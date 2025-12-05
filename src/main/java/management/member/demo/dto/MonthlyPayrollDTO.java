package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO cho tổng lương theo tháng
 * month format: "T1", "T2", ... "T12" (T1 = tháng 1, T2 = tháng 2, ...)
 * Backend lưu YearMonth (YYYY-MM) trong database, convert sang "T1", "T2" khi trả về FE
 */
@Getter
@Setter
public class MonthlyPayrollDTO {
    private String month; // Format: "T1", "T2", ... "T12" (converted from YearMonth for FE display)
    private BigDecimal totalPayroll;
}

