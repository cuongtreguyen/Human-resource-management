package management.member.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OvertimeRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "OT date is required")
    private LocalDate otDate;

    @NotNull(message = "OT hours is required")
    @Min(value = 0, message = "OT hours must be >= 0")
    @Max(value = 24, message = "OT hours must be <= 24")
    private Double otHours;

    private Long taskId; // Optional

    @Size(max = 1000, message = "Reason must not exceed 1000 characters")
    private String reason;

    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;
}

