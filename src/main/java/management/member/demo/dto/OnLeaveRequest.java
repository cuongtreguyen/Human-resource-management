package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.OnLeaveType;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OnLeaveRequest {
    Long employeeId;
    OnLeaveType onLeaveType;
    LocalDate startDate;
    LocalDate endDate;
    String reason;
}
