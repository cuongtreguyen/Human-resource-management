package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CalculatePayrollRequestDTO {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
    
    @NotBlank(message = "Month is required (format: YYYY-MM)")
    private String month; // Format: "YYYY-MM"
    
    @NotNull(message = "Basic salary is required")
    private BigDecimal basicSalary;
    
    private BigDecimal allowance;
    private BigDecimal overtime;
    private BigDecimal bonus;
    private BigDecimal deduction;
}

