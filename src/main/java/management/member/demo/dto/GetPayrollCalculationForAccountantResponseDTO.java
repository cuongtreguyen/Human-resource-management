package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO cho response GET Payroll Calculation của Accountant
 */
@Getter
@Setter
public class GetPayrollCalculationForAccountantResponseDTO {
    private String fullName;
    private BigDecimal baseSalary;
    private BigDecimal otHours;
    private BigDecimal otPay; // Tiền OT (tính từ otHours)
    private BigDecimal allowance;
    private BigDecimal bonus;
    private BigDecimal grossIncome;
    // Bảo hiểm
    private BigDecimal socialInsurance; // BHXH (8%)
    private BigDecimal healthInsurance; // BHYT (1.5%)
    private BigDecimal unemploymentInsurance; // BHTN (1%)
    private BigDecimal generalDeductions;
    private BigDecimal personalIncomeTax; // Thuế TNCN
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
}

