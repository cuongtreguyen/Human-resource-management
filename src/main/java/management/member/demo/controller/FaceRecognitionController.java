package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.service.FlaskApiService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
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
        SystemStatusDTO status = flaskApiService.getSystemStatus();
        return ResponseEntity.ok(status);
    }

    @PostMapping("/take-photos")
    public ResponseEntity<ApiResponseDTO> takePhotos(@Valid @RequestBody PhotoCaptureRequestDTO request) {
        ApiResponseDTO response = flaskApiService.takePhotos(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/train")
    public ResponseEntity<ApiResponseDTO> trainModel() {
        ApiResponseDTO response = flaskApiService.trainModel();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recognize")
    public ResponseEntity<ApiResponseDTO> startRecognition(@RequestParam(required = false) String type) {
        ApiResponseDTO response = flaskApiService.startRecognition(type);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/stop")
    public ResponseEntity<ApiResponseDTO> stopProcess() {
        ApiResponseDTO response = flaskApiService.stopProcess();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/save-photo")
    public ResponseEntity<SavePhotoResponseDTO> savePhoto(@Valid @RequestBody SavePhotoRequestDTO request) {
        SavePhotoResponseDTO response = flaskApiService.savePhoto(request);
        return ResponseEntity.ok(response);
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
    }
}

