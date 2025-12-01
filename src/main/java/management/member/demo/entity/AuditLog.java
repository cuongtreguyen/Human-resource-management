package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(nullable = false, name = "\"user\"")
    private String user; // Email or username
    
    @Column(nullable = false)
    private String action; // "view", "navigate", "update", "create", "delete", "error", "attendance"
    
    @Column(nullable = false)
    private String resource; // "employee", "attendance", "payroll", etc.
    
    @Column(columnDefinition = "TEXT")
    private String details; // Detailed description
    
    private String ipAddress;
    
    private String employeeId; // Optional: related employee ID
}

