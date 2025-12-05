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
    
    // Có thể thêm các field tính toán khác nếu cần
    private BigDecimal grossIncome; // Tổng thu nhập
    private BigDecimal netSalary; // Lương thực lĩnh
}

