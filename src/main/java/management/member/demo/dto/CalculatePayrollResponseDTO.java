package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CalculatePayrollResponseDTO {
    private PayrollData data;
    private boolean success;
    private String message;

    @Getter
    @Setter
    public static class PayrollData {
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
        
        // Additional fields for Frontend
        private BigDecimal grossSalary; // Total before deductions
        
        // Deductions as nested object
        private Deductions deductions;
        
        private BigDecimal totalDeductions; // Sum of all deductions
    }
    
    @Getter
    @Setter
    public static class Deductions {
        private BigDecimal socialInsurance;
        private BigDecimal healthInsurance;
        private BigDecimal unemploymentInsurance;
        private BigDecimal personalIncomeTax;
    }
}

