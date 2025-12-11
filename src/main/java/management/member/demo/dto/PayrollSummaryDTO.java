package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO cho thống kê tổng quan payroll
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayrollSummaryDTO {
    private Long totalEmployees;
    private BigDecimal totalPayroll;
    private BigDecimal totalOTPay;
    private BigDecimal totalInsurance;
    private BigDecimal totalTax;
}

