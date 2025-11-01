package management.member.demo.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollEmployeeSummary {
    private Long employeeId;
    private String employeeName;
    private String departmentName;
    private BigDecimal baseSalary;
    private BigDecimal netSalary;
    private String status; // Paid / Pending
}
