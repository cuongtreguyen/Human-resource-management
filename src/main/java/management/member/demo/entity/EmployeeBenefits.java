package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "employee_benefits")
public class EmployeeBenefits {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "employee_id")
    private Long employeeId;
    
    @Column(name = "benefit_id", unique = true)
    private String benefitId;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "coverage", length = 500)
    private String coverage;
    
    @Column(name = "monthly_cost", length = 100)
    private String monthlyCost;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
}
