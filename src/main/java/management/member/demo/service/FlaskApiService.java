package management.member.demo.service;

import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FlaskApiService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${flask.api.base-url:http://127.0.0.1:5000}")
    private String flaskBaseUrl;

    public SystemStatusDTO getSystemStatus() {
        try {
            String url = flaskBaseUrl + "/api/status";
            ResponseEntity<SystemStatusDTO> response = restTemplate.getForEntity(url, SystemStatusDTO.class);
            return response.getBody();
        } catch (Exception e) {
            // Return default status if Flask API is not available
            SystemStatusDTO status = new SystemStatusDTO();
            status.setStatus("idle");
            status.setMessage("System is idle");
            status.setLastUpdated(java.time.LocalDateTime.now());
            return status;
        }
    }

    public ApiResponseDTO takePhotos(PhotoCaptureRequestDTO request) {
        try {
            String url = flaskBaseUrl + "/api/take-photos";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<PhotoCaptureRequestDTO> entity = new HttpEntity<>(request, headers);
            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            return response.getBody();
        } catch (Exception e) {
            return new ApiResponseDTO("error", e.getMessage(), null);
        }
    }

    public ApiResponseDTO trainModel() {
        try {
            String url = flaskBaseUrl + "/api/train";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            return response.getBody();
        } catch (Exception e) {
            return new ApiResponseDTO("error", e.getMessage(), null);
        }
    }

    public ApiResponseDTO startRecognition(String type) {
        try {
            String url = flaskBaseUrl + "/api/recognize?type=" + type;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            return response.getBody();
        } catch (Exception e) {
            return new ApiResponseDTO("error", e.getMessage(), null);
        }
    }

    public ApiResponseDTO stopProcess() {
        try {
            String url = flaskBaseUrl + "/api/stop";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<ApiResponseDTO> response = restTemplate.postForEntity(url, entity, ApiResponseDTO.class);
            return response.getBody();
        } catch (Exception e) {
            return new ApiResponseDTO("error", e.getMessage(), null);
        }
    }

    public SavePhotoResponseDTO savePhoto(SavePhotoRequestDTO request) {
        try {
            String url = flaskBaseUrl + "/api/save-photo";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<SavePhotoRequestDTO> entity = new HttpEntity<>(request, headers);
            ResponseEntity<SavePhotoResponseDTO> response = restTemplate.postForEntity(url, entity, SavePhotoResponseDTO.class);
            return response.getBody();
        } catch (Exception e) {
            SavePhotoResponseDTO errorResponse = new SavePhotoResponseDTO();
            errorResponse.setStatus("error");
            errorResponse.setMessage(e.getMessage());
            return errorResponse;
        }
    }

    public List<AttendanceFlaskResponseDTO> getAttendanceByEmployeeFlaskFormat(String empId, String startDate, String endDate) {
        // Mock implementation
        return new ArrayList<>();
    }

    public AttendanceStatsDTO getAttendanceStats(String date) {
        AttendanceStatsDTO stats = new AttendanceStatsDTO();
        stats.setTotalEmployees(50);
        stats.setPresent(45);
        stats.setAbsent(5);
        stats.setCheckedOut(40);
        stats.setStillWorking(5);
        return stats;
    }
    
    public Map<String, Object> parseResume(MultipartFile file) {
        try {
            String url = flaskBaseUrl + "/api/resume/parse";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            org.springframework.core.io.Resource resource = file.getResource();
            org.springframework.http.HttpEntity<org.springframework.core.io.Resource> entity = 
                new org.springframework.http.HttpEntity<>(resource, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            Map<String, Object> error = new java.util.HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());
            return error;
        }
    }
    
    public Map<String, Object> getCachedResume(String cacheId) {
        try {
            String url = flaskBaseUrl + "/api/resume/cache/" + cacheId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getBody();
        } catch (Exception e) {
            Map<String, Object> error = new java.util.HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());
            return error;
        }
    }
}

