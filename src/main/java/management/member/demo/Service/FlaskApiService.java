package management.member.demo.Service;

import management.member.demo.Enum.SystemStatusType;
import management.member.demo.config.FlaskApiConfig;
import management.member.demo.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FlaskApiService {
    private static final Logger logger = LoggerFactory.getLogger(FlaskApiService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private FlaskApiConfig flaskApiConfig;

    private String getApiUrl(String endpoint) {
        return flaskApiConfig.getFlaskApiBaseUrl() + endpoint;
    }

    public SystemStatusDTO getSystemStatus() {
        try {
            String url = getApiUrl("/api/status");
            logger.info("Calling Flask API: GET {}", url);
            
            // Nhận response từ Flask API (String status)
            ResponseEntity<SystemStatusResponseDTO> response =
                    restTemplate.getForEntity(url, SystemStatusResponseDTO.class);
            SystemStatusResponseDTO responseDTO = response.getBody();

            logger.info("Flask API response: {} {}", response.getStatusCode(), response.getStatusCode().value());

            if (responseDTO == null) {
                logger.warn("Flask API returned null response");
                return new SystemStatusDTO(SystemStatusType.IDLE.getValue(), "No status available", LocalDateTime.now());
            }

            // Convert từ String sang Enum và từ timestamp sang LocalDateTime
            SystemStatusType statusType = SystemStatusType.fromString(responseDTO.getStatus());
            LocalDateTime lastUpdated = responseDTO.getLastUpdated() != null
                    ? LocalDateTime.ofInstant(
                    Instant.ofEpochSecond(responseDTO.getLastUpdated().longValue()),
                    ZoneId.systemDefault())
                    : LocalDateTime.now();

            logger.info("Successfully retrieved system status from Flask API: status={}, message={}", 
                    statusType, responseDTO.getMessage());
            
            return new SystemStatusDTO(statusType.getValue(), responseDTO.getMessage(), lastUpdated);
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/status: {}", e.getMessage());
            throw new RuntimeException("Failed to get system status from Flask API", e);
        }
    }

    public ApiResponseDTO takePhotos(PhotoCaptureRequestDTO request) {
        try {
            String url = getApiUrl("/api/take-photos");
            logger.info("Calling Flask API: POST {} with userId={}", url, request.getId());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<PhotoCaptureRequestDTO> entity = new HttpEntity<>(request, headers);

            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            logger.info("Flask API response: {} {}", response.getStatusCode(), response.getStatusCode().value());
            logger.info("Successfully called Flask API /api/take-photos");
            
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/take-photos: {}", e.getMessage());
            throw new RuntimeException("Failed to start photo capture", e);
        }
    }

    public ApiResponseDTO trainModel() {
        try {
            String url = getApiUrl("/api/train");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(), headers);

            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/train: {}", e.getMessage());
            throw new RuntimeException("Failed to start training", e);
        }
    }

    public ApiResponseDTO startRecognition(String type) {
        try {
            String url = getApiUrl("/api/recognize?type=" + (type != null ? type : "default"));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(), headers);

            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/recognize: {}", e.getMessage());
            throw new RuntimeException("Failed to start recognition", e);
        }
    }

    public ApiResponseDTO stopProcess() {
        try {
            String url = getApiUrl("/api/stop");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(), headers);

            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/stop: {}", e.getMessage());
            throw new RuntimeException("Failed to stop process", e);
        }
    }

    public List<AttendanceDTO> getDailyAttendance(String date) {
        try {
            String url = getApiUrl("/api/attendance/daily" + (date != null ? "?date=" + date : ""));
            ResponseEntity<AttendanceFlaskResponseDTO[]> response = restTemplate.getForEntity(url, AttendanceFlaskResponseDTO[].class);
            AttendanceFlaskResponseDTO[] flaskResponses = response.getBody();
            if (flaskResponses == null) {
                return List.of();
            }
            return Arrays.stream(flaskResponses)
                    .map(this::convertFlaskAttendanceToDTO)
                    .collect(Collectors.toList());
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/attendance/daily: {}", e.getMessage());
            throw new RuntimeException("Failed to get daily attendance", e);
        }
    }

    /**
     * Get daily attendance và trả về format Flask (không convert)
     */
    public List<AttendanceFlaskResponseDTO> getDailyAttendanceFlaskFormat(String date) {
        try {
            String url = getApiUrl("/api/attendance/daily" + (date != null ? "?date=" + date : ""));
            ResponseEntity<AttendanceFlaskResponseDTO[]> response = restTemplate.getForEntity(url, AttendanceFlaskResponseDTO[].class);
            AttendanceFlaskResponseDTO[] flaskResponses = response.getBody();
            if (flaskResponses == null) {
                return List.of();
            }
            return Arrays.asList(flaskResponses);
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/attendance/daily: {}", e.getMessage());
            throw new RuntimeException("Failed to get daily attendance", e);
        }
    }

    public List<AttendanceDTO> getAttendanceRange(String startDate, String endDate) {
        try {
            String url = getApiUrl("/api/attendance/range?startDate=" + startDate + "&endDate=" + endDate);
            ResponseEntity<AttendanceFlaskResponseDTO[]> response = restTemplate.getForEntity(url, AttendanceFlaskResponseDTO[].class);
            AttendanceFlaskResponseDTO[] flaskResponses = response.getBody();
            if (flaskResponses == null) {
                return List.of();
            }
            return Arrays.stream(flaskResponses)
                    .map(this::convertFlaskAttendanceToDTO)
                    .collect(Collectors.toList());
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/attendance/range: {}", e.getMessage());
            throw new RuntimeException("Failed to get attendance range", e);
        }
    }

    /**
     * Get attendance range và trả về format Flask (không convert)
     */
    public List<AttendanceFlaskResponseDTO> getAttendanceRangeFlaskFormat(String startDate, String endDate) {
        try {
            String url = getApiUrl("/api/attendance/range?startDate=" + startDate + "&endDate=" + endDate);
            ResponseEntity<AttendanceFlaskResponseDTO[]> response = restTemplate.getForEntity(url, AttendanceFlaskResponseDTO[].class);
            AttendanceFlaskResponseDTO[] flaskResponses = response.getBody();
            if (flaskResponses == null) {
                return List.of();
            }
            return Arrays.asList(flaskResponses);
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/attendance/range: {}", e.getMessage());
            throw new RuntimeException("Failed to get attendance range", e);
        }
    }

    public List<AttendanceDTO> getAttendanceByEmployee(String empId, String startDate, String endDate) {
        try {
            String url = getApiUrl("/api/attendance/employee/" + empId);
            if (startDate != null && endDate != null) {
                url += "?startDate=" + startDate + "&endDate=" + endDate;
            }
            ResponseEntity<AttendanceFlaskResponseDTO[]> response = restTemplate.getForEntity(url, AttendanceFlaskResponseDTO[].class);
            AttendanceFlaskResponseDTO[] flaskResponses = response.getBody();
            if (flaskResponses == null) {
                return List.of();
            }
            return Arrays.stream(flaskResponses)
                    .map(this::convertFlaskAttendanceToDTO)
                    .collect(Collectors.toList());
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/attendance/employee: {}", e.getMessage());
            throw new RuntimeException("Failed to get employee attendance", e);
        }
    }

    /**
     * Get attendance by employee và trả về format Flask (không convert)
     */
    public List<AttendanceFlaskResponseDTO> getAttendanceByEmployeeFlaskFormat(String empId, String startDate, String endDate) {
        try {
            String url = getApiUrl("/api/attendance/employee/" + empId);
            if (startDate != null && endDate != null) {
                url += "?startDate=" + startDate + "&endDate=" + endDate;
            }
            ResponseEntity<AttendanceFlaskResponseDTO[]> response = restTemplate.getForEntity(url, AttendanceFlaskResponseDTO[].class);
            AttendanceFlaskResponseDTO[] flaskResponses = response.getBody();
            if (flaskResponses == null) {
                return List.of();
            }
            return Arrays.asList(flaskResponses);
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/attendance/employee: {}", e.getMessage());
            throw new RuntimeException("Failed to get employee attendance", e);
        }
    }

    public AttendanceStatsDTO getAttendanceStats(String date) {
        try {
            String url = getApiUrl("/api/attendance/stats" + (date != null ? "?date=" + date : ""));
            ResponseEntity<AttendanceStatsDTO> response = restTemplate.getForEntity(url, AttendanceStatsDTO.class);
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/attendance/stats: {}", e.getMessage());
            throw new RuntimeException("Failed to get attendance stats", e);
        }
    }

    /**
     * Lưu ảnh từ frontend (base64)
     */
    public SavePhotoResponseDTO savePhoto(SavePhotoRequestDTO request) {
        try {
            String url = getApiUrl("/api/save-photo");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<SavePhotoRequestDTO> entity = new HttpEntity<>(request, headers);

            ResponseEntity<SavePhotoResponseDTO> response = restTemplate.postForEntity(url, entity, SavePhotoResponseDTO.class);
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /api/save-photo: {}", e.getMessage());
            throw new RuntimeException("Failed to save photo", e);
        }
    }

    /**
     * Parse resume file (PDF/DOCX)
     * Note: This requires multipart/form-data, may need special handling
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> parseResume(org.springframework.web.multipart.MultipartFile file) {
        try {
            String url = getApiUrl("/parse_resume");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            org.springframework.util.LinkedMultiValueMap<String, Object> body = new org.springframework.util.LinkedMultiValueMap<>();
            body.add("file", file.getResource());
            
            HttpEntity<org.springframework.util.LinkedMultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(url, entity, (Class<Map<String, Object>>)(Class<?>)Map.class);
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /parse_resume: {}", e.getMessage());
            throw new RuntimeException("Failed to parse resume", e);
        }
    }

    /**
     * Lấy cached resume data
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getCachedResume(String cacheId) {
        try {
            String url = getApiUrl("/resume_cache/" + cacheId);
            ResponseEntity<Map<String, Object>> response = restTemplate.getForEntity(url, (Class<Map<String, Object>>)(Class<?>)Map.class);
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("Error calling Flask API /resume_cache: {}", e.getMessage());
            throw new RuntimeException("Failed to get cached resume", e);
        }
    }

    /**
     * Convert Flask attendance response to AttendanceDTO
     */
    private AttendanceDTO convertFlaskAttendanceToDTO(AttendanceFlaskResponseDTO flaskResponse) {
        AttendanceDTO dto = new AttendanceDTO();
        
        // Convert id (String) to employeeId (Long) if possible
        try {
            if (flaskResponse.getId() != null && !flaskResponse.getId().isEmpty()) {
                dto.setEmployeeId(Long.parseLong(flaskResponse.getId()));
            }
        } catch (NumberFormatException e) {
            logger.warn("Cannot parse employee ID: {}", flaskResponse.getId());
        }
        
        dto.setEmployeeName(flaskResponse.getName());
        dto.setUserId(flaskResponse.getId()); // Keep as String for compatibility
        
        // Convert date string to LocalDate
        if (flaskResponse.getDate() != null && !flaskResponse.getDate().isEmpty()) {
            try {
                dto.setAttendanceDate(LocalDate.parse(flaskResponse.getDate(), DateTimeFormatter.ISO_DATE));
            } catch (Exception e) {
                logger.warn("Cannot parse date: {}", flaskResponse.getDate());
            }
        }
        
        // Convert check_in string to LocalTime
        if (flaskResponse.getCheckIn() != null && !flaskResponse.getCheckIn().isEmpty()) {
            try {
                dto.setCheckIn(LocalTime.parse(flaskResponse.getCheckIn(), DateTimeFormatter.ofPattern("HH:mm:ss")));
            } catch (Exception e) {
                logger.warn("Cannot parse check_in time: {}", flaskResponse.getCheckIn());
            }
        }
        
        // Convert check_out string to LocalTime
        if (flaskResponse.getCheckOut() != null && !flaskResponse.getCheckOut().isEmpty()) {
            try {
                dto.setCheckOut(LocalTime.parse(flaskResponse.getCheckOut(), DateTimeFormatter.ofPattern("HH:mm:ss")));
            } catch (Exception e) {
                logger.warn("Cannot parse check_out time: {}", flaskResponse.getCheckOut());
            }
        }
        
        return dto;
    }
}



