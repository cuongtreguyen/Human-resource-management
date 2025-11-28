package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaceRecognitionResponseDTO {
    private boolean success;
    private String message;
    private String attendanceId; // Optional: attendance ID if saved
    private String checkInTime; // Format: "HH:mm" or null
    private String checkOutTime; // Format: "HH:mm" or null
    private String status; // "checked_in", "checked_out", etc.
    
    // For error response
    private Double confidence; // Optional: confidence score for error response
}

