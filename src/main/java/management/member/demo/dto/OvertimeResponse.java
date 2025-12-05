package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.OverTimeStatus;
import management.member.demo.enums.OverTimeStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OvertimeResponse {
    Long id;
    String employeeId;
    LocalDate otDate;
    Double otHours;
    Long taskId;
    String reason;
    OverTimeStatus overtimeStatus;
    LocalDateTime createdAt;
    String approvedBy;
    String managerNote;
}