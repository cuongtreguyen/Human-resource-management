package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.OverTimeStatus;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Getter
@Setter
public class OverTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    Employee employee;
    @NotNull
    @Column(name = "ot_date", nullable = false)
    LocalDate otDate;
    @NotNull
    @Min(value = 0, message = "Số giờ OT phải lớn hơn hoặc bằng 0")
    @Max(value = 24, message = "Số giờ OT không được vượt quá 24 giờ")
    @Column(name = "ot_hours", nullable = false)
    Double otHours;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    Task task;
    @Size(max = 1000)
    @Column(name = "reason")
    String reason;
    @Size(max = 100)
    @Column(name = "department")
    String department;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    Employee approvedBy;
    @NotNull
    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "overtime_status", nullable = false)
    OverTimeStatus overtimeStatus;
    @Size(max = 1000)
    @Column(name = "manager_note")
    String managerNote;

}