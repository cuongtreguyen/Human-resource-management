package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Column(nullable = false)
    private String type; // "reminder", "alert", "info", "success", "warning", "error"
    
    @Column(nullable = false)
    private String priority; // "high", "medium", "low"
    
    @Column(nullable = false)
    private Boolean read = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private String userId; // Optional: target user ID
    private String employeeId; // Optional: related employee ID
}

