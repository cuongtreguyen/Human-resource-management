package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.enums.OnLeaveType;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OnLeaveResponse {
    Long id;
    Long employeeId;
    OnLeaveType onLeaveType;
    OnLeaveStatus onLeaveStatus;
    LocalDate startDate;
    LocalDate endDate;
    String reason;
    long remainingLeaveDays;
}
