package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaceRecognitionRequestDTO {
    @NotBlank(message = "Employee ID is required")
    @JsonProperty("employeeId")
    private String employeeId;
    
    @NotBlank(message = "Employee name is required")
    @JsonProperty("employeeName")
    private String employeeName;
    
    @NotNull(message = "Confidence is required")
    @JsonProperty("confidence")
    private Double confidence;
    
    @NotBlank(message = "Timestamp is required")
    @JsonProperty("timestamp")
    private String timestamp; // ISO format: "2024-01-15T08:30:00Z"
    
    @JsonProperty("image")
    private String image; // Optional: base64 encoded image
}

