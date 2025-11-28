package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PayrollListItemDTO {
    private String id; // Payroll ID as string
    private String employeeId; // Employee ID (String: employeeId or employeeCode)
    private String employeeName;
    
    @JsonFormat(pattern = "yyyy-MM")
    private String month; // Format: "YYYY-MM"
    
    private BigDecimal basicSalary;
    private BigDecimal allowance;
    private BigDecimal overtime;
    private BigDecimal bonus;
    private BigDecimal deduction;
    private BigDecimal netSalary;
    private String status; // "paid" or "pending" (lowercase)
}

