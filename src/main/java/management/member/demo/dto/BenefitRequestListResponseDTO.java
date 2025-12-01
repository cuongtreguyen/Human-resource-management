package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BenefitRequestListResponseDTO {
    private List<BenefitRequestListItemDTO> data;
    private boolean success;
}

