package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO cho thống kê payroll tổng hợp
 */
@Getter
@Setter
public class PayrollStatisticsDTO {
    private BigDecimal totalPayroll;
    private Long pendingPayroll;
    private BigDecimal allowanceTotal;
    private BigDecimal basicSalaryTotal;
    private BigDecimal insuranceTotal;
    private BigDecimal overtimeTotal;
    private BigDecimal bonusTotal;
    private BigDecimal deductionTotal;
    private BigDecimal payrollGrowth;
    private List<WaitingPayrollListDTO> waitingPayrollList;
    private List<MonthlyPayrollDTO> monthlyPayroll;
    private List<PayrollByDepartmentDTO> payrollByDepartment;
}

