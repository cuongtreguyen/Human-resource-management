package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recruitment_applications")
@Getter
@Setter
public class RecruitmentApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "position_id")
    private RecruitmentPosition position;
    
    @Column(nullable = false)
    private String candidateName;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String experience; // e.g., "4 năm"
    
    @Column(nullable = false)
    private String education;
    
    @Column(nullable = false)
    private String status; // "new", "interview", "offered", "rejected"
    
    @Column(nullable = false)
    private LocalDate appliedDate;
    
    @Column(nullable = false)
    private String resumeUrl;
    
    @Column(columnDefinition = "TEXT")
    private String coverLetter;
    
    private Integer rating; // 1-5
    
    private LocalDateTime interviewDate;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
}

