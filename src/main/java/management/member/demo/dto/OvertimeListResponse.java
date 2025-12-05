package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.OverTimeStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OvertimeListResponse {
    Long id;
    String employeeName;
    String department;
    String title;
    LocalDate deadline;
    Double otHours;
    LocalDate otDate;
    OverTimeStatus overtimeStatus;
    LocalDateTime createdAt;
}