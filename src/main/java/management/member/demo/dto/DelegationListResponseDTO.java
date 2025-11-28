package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DelegationListResponseDTO {
    private List<DelegationListItemDTO> data;
    private boolean success;
}

