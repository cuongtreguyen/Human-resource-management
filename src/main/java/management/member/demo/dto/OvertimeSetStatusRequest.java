package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.OverTimeStatus;
import management.member.demo.enums.OverTimeStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OvertimeSetStatusRequest {
    OverTimeStatus status;
    String managerNote;
}