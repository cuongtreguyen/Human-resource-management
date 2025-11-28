package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmployeeWithEvaluationsListResponseDTO {
    private List<EmployeeWithEvaluationsDTO> data;
    private boolean success;
}

