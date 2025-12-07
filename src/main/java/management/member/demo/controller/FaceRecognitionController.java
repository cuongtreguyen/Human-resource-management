package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.service.FlaskApiService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/face-recognition")
public class FaceRecognitionController {

    @Autowired
    private FlaskApiService flaskApiService;

    @GetMapping("/status")
    public ResponseEntity<SystemStatusDTO> getSystemStatus() {
        try {
            SystemStatusDTO status = flaskApiService.getSystemStatus();
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/take-photos")
    public ResponseEntity<ApiResponseDTO> takePhotos(@Valid @RequestBody PhotoCaptureRequestDTO request) {
        try {
            ApiResponseDTO response = flaskApiService.takePhotos(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponseDTO errorResponse = new ApiResponseDTO("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/train")
    public ResponseEntity<ApiResponseDTO> trainModel() {
        try {
            ApiResponseDTO response = flaskApiService.trainModel();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponseDTO errorResponse = new ApiResponseDTO("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/recognize")
    public ResponseEntity<ApiResponseDTO> startRecognition(@RequestParam(required = false) String type) {
        try {
            ApiResponseDTO response = flaskApiService.startRecognition(type);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponseDTO errorResponse = new ApiResponseDTO("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/stop")
    public ResponseEntity<ApiResponseDTO> stopProcess() {
        try {
            ApiResponseDTO response = flaskApiService.stopProcess();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponseDTO errorResponse = new ApiResponseDTO("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/save-photo")
    public ResponseEntity<SavePhotoResponseDTO> savePhoto(@Valid @RequestBody SavePhotoRequestDTO request) {
        try {
            SavePhotoResponseDTO response = flaskApiService.savePhoto(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            SavePhotoResponseDTO errorResponse = new SavePhotoResponseDTO("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Endpoint để Flask gọi vào khi nhận diện thành công
     * Flask sẽ POST đến endpoint này với payload từ face recognition
     * Redirect đến AttendanceController để xử lý và lưu database
     */
    @PostMapping("/recognition-success")
    public ResponseEntity<RecognitionSuccessResponseDTO> handleRecognitionSuccess(@RequestBody Map<String, Object> payload) {
        // Redirect đến AttendanceController để xử lý và lưu database
        // Endpoint này giữ lại để tương thích, nhưng logic chính ở AttendanceController
        try {
            String employeeIdStr = (String) payload.get("id");
            String employeeName = (String) payload.get("name");
            String timestamp = (String) payload.get("timestamp");
            
            RecognitionSuccessResponseDTO response = new RecognitionSuccessResponseDTO(
                true, 
                "Face recognition successful (use /api/attendance/face-recognition/recognition-success to save to DB)",
                employeeIdStr,
                employeeName
            );
            response.setTimestamp(timestamp);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            RecognitionSuccessResponseDTO errorResponse = new RecognitionSuccessResponseDTO(false, e.getMessage(), null, null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}

