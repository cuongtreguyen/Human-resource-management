package management.member.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.enums.SalaryStatus;

import java.math.BigDecimal;

/**
 * SalaryRequest DTO - Dùng cho tạo và cập nhật Salary
 * netSalary được tính tự động, không cần truyền vào
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryRequest {
    
    @NotNull(message = "ID nhân viên không được để trống")
    private Long employeeId;

    @NotNull(message = "Lương cơ bản không được để trống")
    private BigDecimal baseSalary;

    private BigDecimal allowance;
    private BigDecimal allowances; // Alias cho allowance
    
    private BigDecimal overtimePay;
    private BigDecimal otPay; // Alias cho overtimePay
    private BigDecimal otHours; // Số giờ OT
    
    private BigDecimal bonus;
    private BigDecimal bonuses; // Alias cho bonus
    
    private BigDecimal deduction;
    private BigDecimal deductions; // Alias cho deduction
    
    private BigDecimal grossIncome; // Tổng thu nhập
    private BigDecimal socialInsurance; // BHXH
    private BigDecimal healthInsurance; // BHYT
    private BigDecimal unemploymentInsurance; // BHTN
    private BigDecimal totalInsurance; // Tổng bảo hiểm
    private BigDecimal generalDeductions; // Khấu trừ chung
    private BigDecimal personalIncomeTax; // Thuế thu nhập cá nhân
    private BigDecimal totalDeductions; // Tổng khấu trừ

    @NotNull(message = "Trạng thái lương không được để trống")
    private SalaryStatus status;
}

