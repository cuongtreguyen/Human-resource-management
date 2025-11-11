package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.Enum.OnLeaveStatus;
import management.member.demo.Enum.OnLeaveType;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

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
    OnLeaveType onLeaveType;

    @Enumerated(EnumType.STRING)
    OnLeaveStatus onLeaveStatus;

    LocalDate startDate;
    LocalDate endDate;
    String reason;

    public long getTotalDays() {
        return ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }
}
