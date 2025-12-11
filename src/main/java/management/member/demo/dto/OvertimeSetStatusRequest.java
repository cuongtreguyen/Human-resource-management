package management.member.demo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.enums.OverTimeStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OvertimeSetStatusRequest {
    @NotNull(message = "Status is required")
    private OverTimeStatus status;

    @Size(max = 1000, message = "Manager note must not exceed 1000 characters")
    private String managerNote;
}

