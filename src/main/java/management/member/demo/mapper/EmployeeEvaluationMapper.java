package management.member.demo.mapper;

import management.member.demo.dto.EvaluationListItemDTO;
import management.member.demo.entity.EmployeeEvaluation;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho EmployeeEvaluation
 */
@Component
public class EmployeeEvaluationMapper {

    public EvaluationListItemDTO toEvaluationListItemDTO(EmployeeEvaluation evaluation) {
        EvaluationListItemDTO dto = new EvaluationListItemDTO();
        dto.setId(String.valueOf(evaluation.getId()));
        if (evaluation.getEmployee() != null) {
            dto.setEmployeeId(String.valueOf(evaluation.getEmployee().getId()));
            dto.setEmployeeName(evaluation.getEmployee().getFullName());
        }
        dto.setPeriod(evaluation.getPeriod());
        dto.setReviewDate(evaluation.getReviewDate());
        dto.setOverallRating(evaluation.getOverallRating());
        dto.setReviewer(evaluation.getReviewer());
        return dto;
    }
}

