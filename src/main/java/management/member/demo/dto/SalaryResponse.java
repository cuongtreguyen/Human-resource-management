package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.Enum.SalaryStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

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
    private BigDecimal overtimePay;
    private BigDecimal bonus;
    private BigDecimal deduction;
    private BigDecimal netSalary; // Được tính tự động
    private SalaryStatus status;
    private LocalDate paymentDate;
}

