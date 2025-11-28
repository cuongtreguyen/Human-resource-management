package management.member.demo.Service;

import management.member.demo.config.FlaskApiConfig;
import management.member.demo.dto.*;
import management.member.demo.exception.specifiic.FlaskApiException;
import management.member.demo.util.FlaskApiHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FlaskApiService {
    private static final Logger logger = LoggerFactory.getLogger(FlaskApiService.class);
    
    // Log format chuẩn: [FLASK_API] [METHOD] [ENDPOINT] [STATUS] [MESSAGE]
    private static final String LOG_PREFIX = "[FLASK_API]";

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private FlaskApiConfig flaskApiConfig;
    
    @Autowired
    private FlaskApiHelper flaskApiHelper;

    private String getApiUrl(String endpoint) {
        return flaskApiConfig.getFlaskApiBaseUrl() + endpoint;
    }

    public SystemStatusDTO getSystemStatus() {
        String endpoint = "/api/status";
        String url = getApiUrl(endpoint);
        
        try {
            logger.info("{} [GET] [{}] Calling Flask API", LOG_PREFIX, endpoint);
            
            ResponseEntity<SystemStatusResponseDTO> response =
                    restTemplate.getForEntity(url, SystemStatusResponseDTO.class);
            SystemStatusResponseDTO responseDTO = response.getBody();

            logger.info("{} [GET] [{}] [{}] Response received", 
                LOG_PREFIX, endpoint, response.getStatusCode().value());

            // Convert response sử dụng helper
            SystemStatusDTO result = flaskApiHelper.convertSystemStatus(responseDTO);
            
            logger.info("{} [GET] [{}] [200] Successfully retrieved system status: status={}, message={}", 
                LOG_PREFIX, endpoint, result.getStatus(), result.getMessage());
            
            return result;
        } catch (FlaskApiException e) {
            logger.error("{} [GET] [{}] [VALIDATION_ERROR] Invalid response data: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(e.getMessage(), endpoint, e);
        } catch (RestClientException e) {
            logger.error("{} [GET] [{}] [HTTP_ERROR] Failed to call Flask API: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Không thể kết nối đến Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        } catch (Exception e) {
            logger.error("{} [GET] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    public ApiResponseDTO takePhotos(PhotoCaptureRequestDTO request) {
        String endpoint = "/api/take-photos";
        String url = getApiUrl(endpoint);
        
        try {
            logger.info("{} [POST] [{}] Calling Flask API with userId={}", 
                LOG_PREFIX, endpoint, request != null ? request.getId() : "null");
            
            HttpEntity<PhotoCaptureRequestDTO> entity = flaskApiHelper.buildJsonEntity(request);
            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            
            logger.info("{} [POST] [{}] [{}] Response received", 
                LOG_PREFIX, endpoint, response.getStatusCode().value());
            
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("{} [POST] [{}] [HTTP_ERROR] Failed to call Flask API: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Không thể bắt đầu chụp ảnh: " + e.getMessage(), 
                endpoint, 
                e
            );
        } catch (Exception e) {
            logger.error("{} [POST] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    public ApiResponseDTO trainModel() {
        String endpoint = "/api/train";
        String url = getApiUrl(endpoint);
        
        try {
            logger.info("{} [POST] [{}] Calling Flask API", LOG_PREFIX, endpoint);
            
            HttpEntity<Object> entity = flaskApiHelper.buildEmptyJsonEntity();
            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            
            logger.info("{} [POST] [{}] [{}] Response received", 
                LOG_PREFIX, endpoint, response.getStatusCode().value());
            
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("{} [POST] [{}] [HTTP_ERROR] Failed to call Flask API: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Không thể bắt đầu training: " + e.getMessage(), 
                endpoint, 
                e
            );
        } catch (Exception e) {
            logger.error("{} [POST] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    public ApiResponseDTO startRecognition(String type) {
        String endpoint = "/api/recognize";
        String url = getApiUrl(endpoint + "?type=" + (type != null ? type : "default"));
        
        try {
            logger.info("{} [POST] [{}] Calling Flask API with type={}", 
                LOG_PREFIX, endpoint, type != null ? type : "default");
            
            HttpEntity<Object> entity = flaskApiHelper.buildEmptyJsonEntity();
            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            
            logger.info("{} [POST] [{}] [{}] Response received", 
                LOG_PREFIX, endpoint, response.getStatusCode().value());
            
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("{} [POST] [{}] [HTTP_ERROR] Failed to call Flask API: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Không thể bắt đầu nhận diện: " + e.getMessage(), 
                endpoint, 
                e
            );
        } catch (Exception e) {
            logger.error("{} [POST] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    public ApiResponseDTO stopProcess() {
        String endpoint = "/api/stop";
        String url = getApiUrl(endpoint);
        
        try {
            logger.info("{} [POST] [{}] Calling Flask API", LOG_PREFIX, endpoint);
            
            HttpEntity<Object> entity = flaskApiHelper.buildEmptyJsonEntity();
            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            
            logger.info("{} [POST] [{}] [{}] Response received", 
                LOG_PREFIX, endpoint, response.getStatusCode().value());
            
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("{} [POST] [{}] [HTTP_ERROR] Failed to call Flask API: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Không thể dừng process: " + e.getMessage(), 
                endpoint, 
                e
            );
        } catch (Exception e) {
            logger.error("{} [POST] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    public List<AttendanceDTO> getDailyAttendance(String date) {
        String endpoint = "/api/attendance/daily";
        String url = getApiUrl(endpoint + (date != null ? "?date=" + date : ""));
        
        try {
            logger.info("{} [GET] [{}] Calling Flask API with date={}", 
                LOG_PREFIX, endpoint, date != null ? date : "null");
            
            // Fetch attendance array sử dụng helper
            List<AttendanceFlaskResponseDTO> flaskResponses = 
                flaskApiHelper.fetchAttendanceArray(restTemplate, url);
            
            logger.info("{} [GET] [{}] [200] Response received, count={}", 
                LOG_PREFIX, endpoint, flaskResponses.size());
            
            if (flaskResponses.isEmpty()) {
                logger.debug("{} [GET] [{}] No attendance data returned", LOG_PREFIX, endpoint);
                return List.of();
            }
            
            // Convert sử dụng helper
            List<AttendanceDTO> result = flaskResponses.stream()
                    .map(flaskApiHelper::convertFlaskAttendanceToDTO)
                    .collect(Collectors.toList());
            
            logger.info("{} [GET] [{}] [200] Successfully converted {} attendance records", 
                LOG_PREFIX, endpoint, result.size());
            
            return result;
        } catch (FlaskApiException e) {
            logger.error("{} [GET] [{}] [ERROR] {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(e.getMessage(), endpoint, e);
        } catch (Exception e) {
            logger.error("{} [GET] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    /**
     * Get daily attendance và trả về format Flask (không convert)
     */
    public List<AttendanceFlaskResponseDTO> getDailyAttendanceFlaskFormat(String date) {
        String endpoint = "/api/attendance/daily";
        String url = getApiUrl(endpoint + (date != null ? "?date=" + date : ""));
        
        try {
            logger.info("{} [GET] [{}] Calling Flask API (raw format) with date={}", 
                LOG_PREFIX, endpoint, date != null ? date : "null");
            
            // Fetch attendance array sử dụng helper
            List<AttendanceFlaskResponseDTO> flaskResponses = 
                flaskApiHelper.fetchAttendanceArray(restTemplate, url);
            
            logger.info("{} [GET] [{}] [200] Response received, count={}", 
                LOG_PREFIX, endpoint, flaskResponses.size());
            
            return flaskResponses;
        } catch (FlaskApiException e) {
            logger.error("{} [GET] [{}] [ERROR] {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(e.getMessage(), endpoint, e);
        } catch (Exception e) {
            logger.error("{} [GET] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    public List<AttendanceDTO> getAttendanceRange(String startDate, String endDate) {
        String endpoint = "/api/attendance/range";
        String url = getApiUrl(endpoint + "?startDate=" + startDate + "&endDate=" + endDate);
        
        try {
            logger.info("{} [GET] [{}] Calling Flask API with startDate={}, endDate={}", 
                LOG_PREFIX, endpoint, startDate, endDate);
            
            // Fetch attendance array sử dụng helper
            List<AttendanceFlaskResponseDTO> flaskResponses = 
                flaskApiHelper.fetchAttendanceArray(restTemplate, url);
            
            logger.info("{} [GET] [{}] [200] Response received, count={}", 
                LOG_PREFIX, endpoint, flaskResponses.size());
            
            if (flaskResponses.isEmpty()) {
                logger.debug("{} [GET] [{}] No attendance data returned", LOG_PREFIX, endpoint);
                return List.of();
            }
            
            // Convert sử dụng helper
            List<AttendanceDTO> result = flaskResponses.stream()
                    .map(flaskApiHelper::convertFlaskAttendanceToDTO)
                    .collect(Collectors.toList());
            
            logger.info("{} [GET] [{}] [200] Successfully converted {} attendance records", 
                LOG_PREFIX, endpoint, result.size());
            
            return result;
        } catch (FlaskApiException e) {
            logger.error("{} [GET] [{}] [ERROR] {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(e.getMessage(), endpoint, e);
        } catch (Exception e) {
            logger.error("{} [GET] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    /**
     * Get attendance range và trả về format Flask (không convert)
     */
    public List<AttendanceFlaskResponseDTO> getAttendanceRangeFlaskFormat(String startDate, String endDate) {
        String endpoint = "/api/attendance/range";
        String url = getApiUrl(endpoint + "?startDate=" + startDate + "&endDate=" + endDate);
        
        try {
            logger.info("{} [GET] [{}] Calling Flask API (raw format) with startDate={}, endDate={}", 
                LOG_PREFIX, endpoint, startDate, endDate);
            
            // Fetch attendance array sử dụng helper
            List<AttendanceFlaskResponseDTO> flaskResponses = 
                flaskApiHelper.fetchAttendanceArray(restTemplate, url);
            
            logger.info("{} [GET] [{}] [200] Response received, count={}", 
                LOG_PREFIX, endpoint, flaskResponses.size());
            
            return flaskResponses;
        } catch (FlaskApiException e) {
            logger.error("{} [GET] [{}] [ERROR] {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(e.getMessage(), endpoint, e);
        } catch (Exception e) {
            logger.error("{} [GET] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    public List<AttendanceDTO> getAttendanceByEmployee(String empId, String startDate, String endDate) {
        String endpoint = "/api/attendance/employee/" + empId;
        String url = getApiUrl(endpoint);
        if (startDate != null && endDate != null) {
            url += "?startDate=" + startDate + "&endDate=" + endDate;
        }
        
        try {
            logger.info("{} [GET] [{}] Calling Flask API with empId={}, startDate={}, endDate={}", 
                LOG_PREFIX, endpoint, empId, startDate, endDate);
            
            // Fetch attendance array sử dụng helper
            List<AttendanceFlaskResponseDTO> flaskResponses = 
                flaskApiHelper.fetchAttendanceArray(restTemplate, url);
            
            logger.info("{} [GET] [{}] [200] Response received, count={}", 
                LOG_PREFIX, endpoint, flaskResponses.size());
            
            if (flaskResponses.isEmpty()) {
                logger.debug("{} [GET] [{}] No attendance data returned", LOG_PREFIX, endpoint);
                return List.of();
            }
            
            // Convert sử dụng helper
            List<AttendanceDTO> result = flaskResponses.stream()
                    .map(flaskApiHelper::convertFlaskAttendanceToDTO)
                    .collect(Collectors.toList());
            
            logger.info("{} [GET] [{}] [200] Successfully converted {} attendance records", 
                LOG_PREFIX, endpoint, result.size());
            
            return result;
        } catch (FlaskApiException e) {
            logger.error("{} [GET] [{}] [ERROR] {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(e.getMessage(), endpoint, e);
        } catch (Exception e) {
            logger.error("{} [GET] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    /**
     * Get attendance by employee và trả về format Flask (không convert)
     */
    public List<AttendanceFlaskResponseDTO> getAttendanceByEmployeeFlaskFormat(String empId, String startDate, String endDate) {
        String endpoint = "/api/attendance/employee/" + empId;
        String url = getApiUrl(endpoint);
        if (startDate != null && endDate != null) {
            url += "?startDate=" + startDate + "&endDate=" + endDate;
        }
        
        try {
            logger.info("{} [GET] [{}] Calling Flask API (raw format) with empId={}, startDate={}, endDate={}", 
                LOG_PREFIX, endpoint, empId, startDate, endDate);
            
            // Fetch attendance array sử dụng helper
            List<AttendanceFlaskResponseDTO> flaskResponses = 
                flaskApiHelper.fetchAttendanceArray(restTemplate, url);
            
            logger.info("{} [GET] [{}] [200] Response received, count={}", 
                LOG_PREFIX, endpoint, flaskResponses.size());
            
            return flaskResponses;
        } catch (FlaskApiException e) {
            logger.error("{} [GET] [{}] [ERROR] {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(e.getMessage(), endpoint, e);
        } catch (Exception e) {
            logger.error("{} [GET] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    public AttendanceStatsDTO getAttendanceStats(String date) {
        String endpoint = "/api/attendance/stats";
        String url = getApiUrl(endpoint + (date != null ? "?date=" + date : ""));
        
        try {
            logger.info("{} [GET] [{}] Calling Flask API with date={}", 
                LOG_PREFIX, endpoint, date != null ? date : "null");
            
            ResponseEntity<AttendanceStatsDTO> response = 
                restTemplate.getForEntity(url, AttendanceStatsDTO.class);
            
            logger.info("{} [GET] [{}] [{}] Response received", 
                LOG_PREFIX, endpoint, response.getStatusCode().value());
            
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("{} [GET] [{}] [HTTP_ERROR] Failed to call Flask API: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Không thể lấy thống kê chấm công: " + e.getMessage(), 
                endpoint, 
                e
            );
        } catch (Exception e) {
            logger.error("{} [GET] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    /**
     * Lưu ảnh từ frontend (base64)
     */
    public SavePhotoResponseDTO savePhoto(SavePhotoRequestDTO request) {
        String endpoint = "/api/save-photo";
        String url = getApiUrl(endpoint);
        
        try {
            logger.info("{} [POST] [{}] Calling Flask API", LOG_PREFIX, endpoint);
            
            HttpEntity<SavePhotoRequestDTO> entity = flaskApiHelper.buildJsonEntity(request);
            ResponseEntity<SavePhotoResponseDTO> response = 
                restTemplate.postForEntity(url, entity, SavePhotoResponseDTO.class);
            
            logger.info("{} [POST] [{}] [{}] Response received", 
                LOG_PREFIX, endpoint, response.getStatusCode().value());
            
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("{} [POST] [{}] [HTTP_ERROR] Failed to call Flask API: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Không thể lưu ảnh: " + e.getMessage(), 
                endpoint, 
                e
            );
        } catch (Exception e) {
            logger.error("{} [POST] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    /**
     * Parse resume file (PDF/DOCX)
     * Note: This requires multipart/form-data, may need special handling
     */
    public Map<String, Object> parseResume(org.springframework.web.multipart.MultipartFile file) {
        String endpoint = "/parse_resume";
        String url = getApiUrl(endpoint);
        
        // Validate file
        if (file == null || file.isEmpty()) {
            logger.warn("{} [POST] [{}] [VALIDATION_ERROR] File is null or empty", LOG_PREFIX, endpoint);
            throw new FlaskApiException("File không được để trống", endpoint);
        }
        
        try {
            logger.info("{} [POST] [{}] Calling Flask API with file: name={}, size={} bytes", 
                LOG_PREFIX, endpoint, file.getOriginalFilename(), file.getSize());
            
            HttpEntity<org.springframework.util.LinkedMultiValueMap<String, Object>> entity = 
                flaskApiHelper.buildMultipartEntity(file);
            
            // Type-safe với ParameterizedTypeReference
            ParameterizedTypeReference<Map<String, Object>> responseType = 
                new ParameterizedTypeReference<Map<String, Object>>() {};
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, responseType);
            
            logger.info("{} [POST] [{}] [{}] Response received", 
                LOG_PREFIX, endpoint, response.getStatusCode().value());
            
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("{} [POST] [{}] [HTTP_ERROR] Failed to call Flask API: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Không thể parse resume: " + e.getMessage(), 
                endpoint, 
                e
            );
        } catch (Exception e) {
            logger.error("{} [POST] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

    /**
     * Lấy cached resume data
     */
    public Map<String, Object> getCachedResume(String cacheId) {
        String endpoint = "/resume_cache/" + cacheId;
        String url = getApiUrl(endpoint);
        
        try {
            logger.info("{} [GET] [{}] Calling Flask API with cacheId={}", 
                LOG_PREFIX, endpoint, cacheId);
            
            // Type-safe với ParameterizedTypeReference
            ParameterizedTypeReference<Map<String, Object>> responseType = 
                new ParameterizedTypeReference<Map<String, Object>>() {};
            ResponseEntity<Map<String, Object>> response = 
                restTemplate.exchange(url, HttpMethod.GET, null, responseType);
            
            logger.info("{} [GET] [{}] [{}] Response received", 
                LOG_PREFIX, endpoint, response.getStatusCode().value());
            
            return response.getBody();
        } catch (RestClientException e) {
            logger.error("{} [GET] [{}] [HTTP_ERROR] Failed to call Flask API: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Không thể lấy cached resume: " + e.getMessage(), 
                endpoint, 
                e
            );
        } catch (Exception e) {
            logger.error("{} [GET] [{}] [UNEXPECTED_ERROR] Unexpected error: {}", 
                LOG_PREFIX, endpoint, e.getMessage(), e);
            throw new FlaskApiException(
                "Lỗi không mong đợi khi gọi Flask API: " + e.getMessage(), 
                endpoint, 
                e
            );
        }
    }

}





