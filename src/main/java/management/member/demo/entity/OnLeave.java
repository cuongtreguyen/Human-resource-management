package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.enums.OnLeaveType;

import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Getter
@Setter
public class OnLeave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    Employee employee;

    @Enumerated(EnumType.STRING)
    private OnLeaveType onLeaveType;
    @Enumerated(EnumType.STRING)
    private OnLeaveStatus onLeaveStatus;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    @Column(name = "submitted_date")
    LocalDate submittedDate;
    @Column(name = "total_days_onleave")
    private Long totalDaysOnleave;
}
