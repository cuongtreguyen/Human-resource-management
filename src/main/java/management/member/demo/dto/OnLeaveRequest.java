package management.member.demo.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.Enum.OnLeaveType;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OnLeaveRequest {
    Long employeeId;
    @Enumerated(EnumType.STRING)
    OnLeaveType onLeaveType;
    LocalDate startDate;
    LocalDate endDate;
    String reason;
}
