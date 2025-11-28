package management.member.demo.util;

import management.member.demo.dto.AttendanceDTO;
import management.member.demo.dto.AttendanceFlaskResponseDTO;
import management.member.demo.Enum.SystemStatusType;
import management.member.demo.dto.SystemStatusResponseDTO;
import management.member.demo.dto.SystemStatusDTO;
import management.member.demo.exception.specifiic.FlaskApiException;
import management.member.demo.validator.FlaskApiValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Helper class cho Flask API operations
 * Chứa các method tái sử dụng cho HTTP request và convert DTO
 */
@Component
public class FlaskApiHelper {
    
    private static final Logger logger = LoggerFactory.getLogger(FlaskApiHelper.class);
    
    private final FlaskApiValidator flaskApiValidator;
    
    @Autowired
    public FlaskApiHelper(FlaskApiValidator flaskApiValidator) {
        this.flaskApiValidator = flaskApiValidator;
    }
    
    /**
     * Build HttpEntity với JSON headers
     * 
     * @param body Request body
     * @return HttpEntity với JSON headers
     */
    public <T> HttpEntity<T> buildJsonEntity(T body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }
    
    /**
     * Build HttpEntity với multipart/form-data headers
     * 
     * @param file MultipartFile
     * @return HttpEntity với multipart headers
     */
    public HttpEntity<LinkedMultiValueMap<String, Object>> buildMultipartEntity(MultipartFile file) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        
        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());
        
        return new HttpEntity<>(body, headers);
    }
    
    /**
     * Build HttpEntity với empty body và JSON headers
     * 
     * @return HttpEntity với empty body và JSON headers
     */
    public HttpEntity<Object> buildEmptyJsonEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(new java.util.HashMap<>(), headers);
    }
    
    /**
     * Convert SystemStatusResponseDTO từ Flask API sang SystemStatusDTO
     * 
     * @param responseDTO Response từ Flask API
     * @return SystemStatusDTO
     * @throws FlaskApiException nếu dữ liệu không hợp lệ
     */
    public SystemStatusDTO convertSystemStatus(SystemStatusResponseDTO responseDTO) {
        if (responseDTO == null) {
            logger.warn("Flask API returned null system status response");
            return new SystemStatusDTO(
                SystemStatusType.IDLE.getValue(), 
                "No status available", 
                LocalDateTime.now()
            );
        }
        
        // Validate và convert status
        SystemStatusType statusType;
        try {
            statusType = SystemStatusType.fromString(responseDTO.getStatus());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid system status from Flask API: {}", responseDTO.getStatus(), e);
            throw new FlaskApiException(
                String.format("Trạng thái hệ thống không hợp lệ: %s", responseDTO.getStatus()),
                e
            );
        }
        
        // Validate và convert timestamp
        LocalDateTime lastUpdated = responseDTO.getLastUpdated() != null
            ? flaskApiValidator.validateTimestamp(
                Instant.ofEpochSecond(responseDTO.getLastUpdated().longValue())
            )
            : LocalDateTime.now();
        
        logger.debug("Converted system status: status={}, message={}, lastUpdated={}", 
            statusType, responseDTO.getMessage(), lastUpdated);
        
        return new SystemStatusDTO(statusType.getValue(), responseDTO.getMessage(), lastUpdated);
    }
    
    /**
     * Fetch attendance array từ Flask API (common logic)
     * 
     * @param url Full URL của Flask API endpoint
     * @return List<AttendanceFlaskResponseDTO> hoặc empty list nếu null
     * @throws FlaskApiException nếu HTTP call fail
     */
    public List<AttendanceFlaskResponseDTO> fetchAttendanceArray(
            org.springframework.web.client.RestTemplate restTemplate, String url) {
        try {
            org.springframework.http.ResponseEntity<AttendanceFlaskResponseDTO[]> response = 
                restTemplate.getForEntity(url, AttendanceFlaskResponseDTO[].class);
            AttendanceFlaskResponseDTO[] flaskResponses = response.getBody();
            
            if (flaskResponses == null || flaskResponses.length == 0) {
                return java.util.List.of();
            }
            return java.util.Arrays.asList(flaskResponses);
        } catch (org.springframework.web.client.RestClientException e) {
            throw new FlaskApiException(
                "Không thể lấy dữ liệu chấm công từ Flask API: " + e.getMessage(), 
                url, 
                e
            );
        }
    }
    
    /**
     * Convert AttendanceFlaskResponseDTO từ Flask API sang AttendanceDTO
     * 
     * @param flaskResponse Response từ Flask API
     * @return AttendanceDTO
     * @throws FlaskApiException nếu dữ liệu không hợp lệ
     */
    public AttendanceDTO convertFlaskAttendanceToDTO(AttendanceFlaskResponseDTO flaskResponse) {
        if (flaskResponse == null) {
            logger.warn("Flask API returned null attendance response");
            throw new FlaskApiException("Attendance response không được để trống");
        }
        
        AttendanceDTO dto = new AttendanceDTO();
        
        // Validate và convert employee ID
        if (flaskResponse.getId() != null && !flaskResponse.getId().isEmpty()) {
            try {
                dto.setEmployeeId(flaskApiValidator.validateEmployeeId(flaskResponse.getId()));
            } catch (FlaskApiException e) {
                logger.warn("Cannot parse employee ID from Flask API: {}", flaskResponse.getId());
                // Không throw exception, chỉ log warning và giữ null
            }
        }
        
        dto.setEmployeeName(flaskResponse.getName());
        dto.setUserId(flaskResponse.getId()); // Keep as String for compatibility
        
        // Validate và convert date
        if (flaskResponse.getDate() != null && !flaskResponse.getDate().isEmpty()) {
            try {
                dto.setAttendanceDate(flaskApiValidator.validateDate(flaskResponse.getDate()));
            } catch (FlaskApiException e) {
                logger.warn("Cannot parse date from Flask API: {}", flaskResponse.getDate());
                // Không throw exception, chỉ log warning và giữ null
            }
        }
        
        // Validate và convert check_in time
        if (flaskResponse.getCheckIn() != null && !flaskResponse.getCheckIn().isEmpty()) {
            try {
                dto.setCheckIn(flaskApiValidator.validateTime(flaskResponse.getCheckIn()));
            } catch (FlaskApiException e) {
                logger.warn("Cannot parse check_in time from Flask API: {}", flaskResponse.getCheckIn());
                // Không throw exception, chỉ log warning và giữ null
            }
        }
        
        // Validate và convert check_out time
        if (flaskResponse.getCheckOut() != null && !flaskResponse.getCheckOut().isEmpty()) {
            try {
                dto.setCheckOut(flaskApiValidator.validateTime(flaskResponse.getCheckOut()));
            } catch (FlaskApiException e) {
                logger.warn("Cannot parse check_out time from Flask API: {}", flaskResponse.getCheckOut());
                // Không throw exception, chỉ log warning và giữ null
            }
        }
        
        logger.debug("Converted Flask attendance to DTO: employeeId={}, date={}, checkIn={}, checkOut={}", 
            dto.getEmployeeId(), dto.getAttendanceDate(), dto.getCheckIn(), dto.getCheckOut());
        
        return dto;
    }
}

