package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.entity.Employee;
import management.member.demo.entity.Task;
import management.member.demo.enums.OverTimeStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OvertimeDetailResponse {
    Long id;
    String employeeName;
    String department;
    LocalDate otDate;
    String title;
    LocalDate deadline;
    Double otHours;
    String reason;
    OverTimeStatus overtimeStatus;
    LocalDateTime createdAt;
}