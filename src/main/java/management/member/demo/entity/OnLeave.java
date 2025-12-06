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
    @Column(name = "on_leave_type", nullable = false)
    private OnLeaveType onLeaveType;

    @Enumerated(EnumType.STRING)
    @Column(name = "on_leave_status", nullable = false)
    private OnLeaveStatus onLeaveStatus;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private String reason;
    @Column(name = "submitted_date")
    LocalDate submittedDate;
    @Column(name = "total_days_onleave")
    private Long totalDaysOnleave;
}
