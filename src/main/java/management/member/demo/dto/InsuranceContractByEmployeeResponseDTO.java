package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO cho response getAllInsuranceContractbyEmployeeId
 */
@Getter
@Setter
public class InsuranceContractByEmployeeResponseDTO {
    private String employeeId;
    private String fullName;
    private String department;
    private Long contractId;
    private String insurenceName;
    private BigDecimal employerRate;
    private BigDecimal employeeRate;
    private LocalDate grantDate;
}

