package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ApprovedOvertimeRequest {
    Long overtimeId;
    String status;
    String managerNote;
}