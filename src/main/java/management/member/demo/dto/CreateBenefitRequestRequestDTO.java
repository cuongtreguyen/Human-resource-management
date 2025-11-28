package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateBenefitRequestRequestDTO {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
    
    @NotBlank(message = "Type is required")
    private String type; // "add-dependent", etc.
    
    @NotBlank(message = "Type label is required")
    private String typeLabel;
    
    @NotBlank(message = "Reason is required")
    private String reason;
    
    private List<String> attachments;
}

