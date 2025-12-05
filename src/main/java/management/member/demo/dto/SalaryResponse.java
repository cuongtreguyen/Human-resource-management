package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.enums.SalaryStatus;

import java.math.BigDecimal;

/**
 * SalaryResponse DTO - Response cho Salary
 * Bao gồm netSalary đã được tính tự động
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryResponse {
    
    private Long id;
    private Long employeeId;
    private BigDecimal baseSalary;
    private BigDecimal allowance;
    private BigDecimal allowances; // Alias cho allowance
    private BigDecimal overtimePay;
    private BigDecimal otPay; // Alias cho overtimePay
    private BigDecimal bonus;
    private BigDecimal bonuses; // Alias cho bonus
    private BigDecimal deduction;
    private BigDecimal deductions; // Alias cho deduction
    private BigDecimal otHours; // Số giờ OT
    private BigDecimal grossIncome; // Tổng thu nhập
    private BigDecimal socialInsurance; // BHXH
    private BigDecimal healthInsurance; // BHYT
    private BigDecimal unemploymentInsurance; // BHTN
    private BigDecimal totalInsurance; // Tổng bảo hiểm
    private BigDecimal generalDeductions; // Khấu trừ chung
    private BigDecimal personalIncomeTax; // Thuế thu nhập cá nhân
    private BigDecimal totalDeductions; // Tổng khấu trừ
    private BigDecimal netSalary; // Được tính tự động
    private SalaryStatus status;
}

