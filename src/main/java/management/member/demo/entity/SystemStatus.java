package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.Enum.SystemStatusType;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Convert(converter = management.member.demo.converter.SystemStatusTypeAttributeConverter.class)
    @Column(name = "status", nullable = false)
    private SystemStatusType status;

    @Column(name = "message")
    private String message;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
