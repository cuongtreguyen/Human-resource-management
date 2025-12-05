package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OvertimeRequest {
    Long employeeId;
    LocalDate otDate;
    Double otHours;
    Long taskId;
    String reason;
    LocalDateTime createdAt;
}