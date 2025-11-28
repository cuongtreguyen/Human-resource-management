package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "employee_evaluations")
@Getter
@Setter
public class EmployeeEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    @Column(nullable = false)
    private String period; // e.g., "Quý 4/2024"
    
    @Column(nullable = false)
    private LocalDate reviewDate;
    
    @Column(nullable = false)
    private Integer workPerformance; // 1-5
    
    @Column(nullable = false)
    private Integer teamwork; // 1-5
    
    @Column(nullable = false)
    private Integer attitude; // 1-5
    
    @Column(nullable = false)
    private Double overallRating; // Calculated average
    
    @Column(columnDefinition = "TEXT")
    private String strengths;
    
    @Column(columnDefinition = "TEXT")
    private String improvements;
    
    @Column(columnDefinition = "TEXT")
    private String comments;
    
    @Column(nullable = false)
    private String reviewer; // Reviewer name or ID
    
    @Column(nullable = false)
    private String reviewerRole; // "manager", "hr", "director"
}

