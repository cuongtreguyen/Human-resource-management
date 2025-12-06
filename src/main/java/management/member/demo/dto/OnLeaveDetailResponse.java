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
public class OnLeaveDetailResponse {
    Long id;
    String fullName;
    String department;
    OnLeaveStatus onLeaveStatus;
    OnLeaveType onLeaveType;
    LocalDate submittedDate;
    LocalDate startDate;
    LocalDate endDate;
    Long totalDaysOnleave;
    String reason;
}