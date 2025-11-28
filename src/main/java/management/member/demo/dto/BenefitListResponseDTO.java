package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BenefitListResponseDTO {
    private List<BenefitDTO> data;
    private boolean success;
}

