package management.member.demo.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
public class EvaluationResponse {
    Long id;
    String employeeName;
    String evaluatorName;
    LocalDate evaluationDate;

    Double workPerformanceScore;
    Double teamworkScore;
    Double attitudeScore;
    Double averageScore;

    String strengths;
    String goals;
}