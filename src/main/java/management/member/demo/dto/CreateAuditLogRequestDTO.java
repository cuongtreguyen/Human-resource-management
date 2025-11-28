package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAuditLogRequestDTO {
    @NotBlank(message = "User is required")
    private String user;
    
    @NotBlank(message = "Action is required")
    private String action;
    
    @NotBlank(message = "Resource is required")
    private String resource;
    
    private String details;
    private String ipAddress;
}

