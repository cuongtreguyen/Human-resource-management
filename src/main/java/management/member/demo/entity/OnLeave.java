package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotNull
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    Employee employee;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "on_leave_type", nullable = false)
    private OnLeaveType onLeaveType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "on_leave_status", nullable = false)
    private OnLeaveStatus onLeaveStatus;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Size(max = 1000)
    @Column(name = "reason")
    private String reason;
    @Column(name = "submitted_date")
    LocalDate submittedDate;
    @Column(name = "total_days_onleave")
    private Long totalDaysOnleave;
}
