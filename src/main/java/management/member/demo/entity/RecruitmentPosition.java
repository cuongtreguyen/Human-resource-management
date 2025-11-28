package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "recruitment_positions")
@Getter
@Setter
public class RecruitmentPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private String type; // "Full-time", "Part-time", "Contract"
    
    @Column(nullable = false)
    private String level; // "Junior", "Senior", "Lead", etc.
    
    @Column(nullable = false)
    private String salary; // e.g., "25,000,000 - 35,000,000 VNĐ"
    
    @Column(nullable = false)
    private String experience; // e.g., "3-5 năm"
    
    @Column(nullable = false)
    private Integer openings;
    
    @Column(nullable = false)
    private String status; // "active", "closed"
    
    @Column(nullable = false)
    private LocalDate postedDate;
    
    @Column(nullable = false)
    private LocalDate closingDate;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String requirements; // JSON array of requirements
    
    private Integer applicationsCount = 0;
}

