package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.BenefitsStatus;

import java.time.LocalDate;

/**
 * DTO cho request update Employee Benefit
 */
@Getter
@Setter
public class UpdateEmployeeBenefitRequestDTO {
    @NotBlank(message = "Benefit ID không được để trống")
    private String benefitId;
    
    private LocalDate grantDate;
    
    private BenefitsStatus status;
}

