package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "documents")
@Getter
@Setter
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String category; // "policy", "finance", "company", "training", "hr"
    
    @Column(nullable = false)
    private String type; // "pdf", "docx", "xlsx", etc.
    
    @Column(nullable = false)
    private String size; // e.g., "2.5 MB"
    
    @Column(nullable = false)
    private String uploadedBy; // Username or email
    
    @Column(nullable = false)
    private LocalDate uploadedDate;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String url; // File path or URL
    
    @Column(nullable = false)
    private String accessLevel; // "all", "admin", "manager", "accountant"
    
    private Integer downloads = 0;
    
    private String version = "1.0";
}

