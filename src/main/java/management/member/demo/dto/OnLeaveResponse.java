package management.member.demo.dto;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.Enum.OnLeaveStatus;
import management.member.demo.Enum.OnLeaveType;

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
