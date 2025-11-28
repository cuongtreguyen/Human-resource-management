package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeWithEvaluationsDTO {
    private String id;
    private String name;
    private String email;
    private String department;
    private EmployeeEvaluationSummaryDTO lastEvaluation;
    private Integer evaluationCount;
}

