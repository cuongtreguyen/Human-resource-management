package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendMessageRequestDTO {
    @NotBlank(message = "Receiver ID is required")
    private String receiverId;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private String type; // "text", "image", "file" (default: "text")
}

