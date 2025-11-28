package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTicketRequestDTO {
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Priority is required")
    private String priority;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
}

