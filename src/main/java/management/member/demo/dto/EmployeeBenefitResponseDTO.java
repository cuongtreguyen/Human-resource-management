package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.BenefitsStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO cho response getAllBenefitEmployeeById
 */
@Getter
@Setter
public class EmployeeBenefitResponseDTO {
    private String employeeId;
    private String fullName;
    private String department;
    private String benefitId;
    private String benefitName;
    private BigDecimal allowanceAmount;
    private LocalDate grantDate;
    private BenefitsStatus status;
}

