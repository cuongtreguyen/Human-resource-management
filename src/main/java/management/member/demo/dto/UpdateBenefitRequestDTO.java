package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.BenefitsStatus;

import java.math.BigDecimal;

/**
 * DTO cho request update Benefit (template benefit)
 */
@Getter
@Setter
public class UpdateBenefitRequestDTO {
    @NotBlank(message = "Tên phúc lợi không được để trống")
    private String benefitName;
    
    private String description;
    
    private Integer numberOfEmployees;
    
    private String coverage;
    
    private BigDecimal allowanceAmount;
    
    private BenefitsStatus status;
}

