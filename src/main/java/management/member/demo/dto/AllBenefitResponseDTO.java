package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.BenefitsStatus;

import java.math.BigDecimal;

/**
 * DTO cho response getAllBenefit (template benefits)
 */
@Getter
@Setter
public class AllBenefitResponseDTO {
    private Long id;
    private String benefitId;
    private String benefitName;
    private BigDecimal allowance_amount;
    private String department;
    private Integer numberOfEmployees;
    private BenefitsStatus status;
    private BigDecimal totalCost;
}

