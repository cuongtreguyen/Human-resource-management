package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.InsuranceContractStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO cho response Insurance Contract (template contract)
 */
@Getter
@Setter
public class InsuranceContractResponseDTO {
    private Long id;
    private String insurenceName;
    private BigDecimal employerRate;
    private BigDecimal employeeRate;
    private String provider;
    private LocalDate effective;
    private LocalDate expiry;
    private InsuranceContractStatus status;
}

