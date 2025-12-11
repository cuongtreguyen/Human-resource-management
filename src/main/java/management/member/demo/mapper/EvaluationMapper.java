package management.member.demo.mapper;

import management.member.demo.dto.EvaluationResponse;
import management.member.demo.entity.Evaluation;
import org.springframework.stereotype.Component;

@Component
public class EvaluationMapper {

    public EvaluationResponse toResponse(Evaluation eval) {
        return EvaluationResponse.builder()
                .id(eval.getId())
                .employeeName(eval.getEmployee().getFullName())
                .evaluatorName(eval.getEvaluator() != null ? eval.getEvaluator().getFullName() : "Unknown")
                .evaluationDate(eval.getEvaluationDate())
                .workPerformanceScore(eval.getWorkPerformanceScore())
                .teamworkScore(eval.getTeamworkScore())
                .attitudeScore(eval.getAttitudeScore())
                .averageScore(eval.getAverageScore())
                .strengths(eval.getStrengths())
                .goals(eval.getGoals())
                .build();
    }
}

