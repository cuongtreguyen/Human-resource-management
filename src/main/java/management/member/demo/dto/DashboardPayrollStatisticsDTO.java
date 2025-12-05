package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO cho Dashboard Payroll Statistics
 */
@Getter
@Setter
public class DashboardPayrollStatisticsDTO {
    private BigDecimal totalPayroll;
    private Long pendingPayroll;
    private BigDecimal payrollGrowth;
    private BigDecimal basicSalaryTotal;
    private BigDecimal allowanceTotal;
    private BigDecimal overtimeTotal;
    private BigDecimal bonusTotal;
    private BigDecimal deductionTotal;
    private BigDecimal insuranceTotal;
    private List<PayrollByDepartmentDTO> payrollByDepartment;
    private List<MonthlyPayrollDTO> monthlyPayroll;
    private List<WaitingPayrollListDTO> pendingPayrollList;
}

