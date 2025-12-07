package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO cho response tính toán Payroll của Accountant
 */
@Getter
@Setter
public class PayrollCalculationForAccountantResponseDTO {
    private String fullName;
    private BigDecimal baseSalary;
    private BigDecimal otHours;
    private String dayOff;
    private String lateDay;
    private BigDecimal allowance;
    private BigDecimal generalDeductions;
    private BigDecimal bonus;
    
    // Các field tính toán
    private BigDecimal otPay; // Tiền OT (tính từ otHours × 100,000 VND/giờ)
    private BigDecimal grossIncome; // Tổng thu nhập
    private BigDecimal socialInsurance; // BHXH (8% của baseSalary)
    private BigDecimal healthInsurance; // BHYT (1.5% của baseSalary)
    private BigDecimal unemploymentInsurance; // BHTN (1% của baseSalary)
    private BigDecimal totalInsurance; // Tổng bảo hiểm (socialInsurance + healthInsurance + unemploymentInsurance)
    private BigDecimal personalIncomeTax; // Thuế thu nhập cá nhân (bậc lũy tiến)
    private BigDecimal totalDeductions; // Tổng khấu trừ
    private BigDecimal netSalary; // Lương thực lĩnh
    private String status; // Trạng thái lương (AWAITING, SUCCESS, FAILED, CANCELLED)
}

