package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EvaluationListResponseDTO {
    private List<EvaluationListItemDTO> data;
    private boolean success;
}

