package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String type; // "employee_summary", "attendance_summary", etc.
    
    @Column(nullable = false)
    private String format; // "pdf", "excel"
    
    @Column(nullable = false)
    private String status; // "pending", "processing", "completed", "failed"
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String filename;
    
    @Column(nullable = false)
    private String url;
    
    @Column(nullable = false)
    private LocalDateTime generatedAt;
    
    @Column(columnDefinition = "TEXT")
    private String parameters; // JSON string of parameters
}

