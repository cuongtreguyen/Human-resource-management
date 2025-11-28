package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RespondToTicketRequestDTO {
    @NotBlank(message = "Response is required")
    private String response;
    
    private String status; // "resolved", "closed", etc.
}

