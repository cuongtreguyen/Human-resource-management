package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "support_tickets")
@Getter
@Setter
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(nullable = false)
    private String category; // "profile-update", "leave", "payroll", "attendance", etc.
    
    @Column(nullable = false)
    private String priority; // "low", "medium", "high", "urgent"
    
    @Column(nullable = false)
    private String status; // "open", "in-progress", "resolved", "closed"
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private LocalDate createdDate;
    
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    @Column(nullable = false)
    private String assignedTo; // Department or user
    
    @Column(columnDefinition = "TEXT")
    private String response;
}

