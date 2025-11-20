package management.member.demo.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeBenefits {
    private Long id;
    private Long employeeId;
    private String benefitId;    // NEW
    private String name;
    private String status;
    private String description;
    private String coverage;
    private String monthlyCost;
    private LocalDate startDate;
    private LocalDate endDate;
}
