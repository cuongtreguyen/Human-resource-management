package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollVoluntaryInsuranceRequestDTO {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
    
    @NotBlank(message = "Insurance ID is required")
    private String insuranceId;
}

