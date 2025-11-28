package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "policies")
@Getter
@Setter
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String type; // "leave", "payroll", "attendance", "hr", etc.
    
    @Column(nullable = false)
    private String status; // "active", "inactive", "draft"
    
    @Column(nullable = false)
    private LocalDate effectiveDate;
}

