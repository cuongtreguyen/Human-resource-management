package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CalculatePayrollResponseDTO {
    private String id; // Payroll ID as string
    private String employeeId;
    private String employeeName;
    private String month; // Format: "YYYY-MM"
    private BigDecimal basicSalary;
    private BigDecimal allowance;
    private BigDecimal overtime;
    private BigDecimal bonus;
    private BigDecimal deduction;
    private BigDecimal netSalary;
    private String status; // "pending" or "paid"
    private String message;
    private boolean success;
}

