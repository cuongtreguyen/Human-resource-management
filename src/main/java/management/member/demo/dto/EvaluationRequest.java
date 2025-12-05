package management.member.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
public class EvaluationRequest {
    @NotNull(message = "Phải chọn nhân viên")
    Long employeeId;

    LocalDate evaluationDate;

    @Min(1) @Max(5)
    Double workPerformanceScore;

    @Min(1) @Max(5)
    Double teamworkScore;

    @Min(1) @Max(5)
    Double attitudeScore;

    String strengths;
    String goals;
}