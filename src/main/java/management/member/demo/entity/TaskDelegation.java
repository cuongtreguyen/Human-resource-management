package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "task_delegations")
@Getter
@Setter
public class TaskDelegation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "from_employee_id")
    private Employee fromEmployee;
    
    @ManyToOne
    @JoinColumn(name = "to_employee_id")
    private Employee toEmployee;
    
    @Column(columnDefinition = "TEXT")
    private String taskIds; // JSON array of task IDs
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @Column(nullable = false)
    private String status; // "pending", "approved", "rejected"
    
    @Column(nullable = false)
    private LocalDate createdAt;
}

