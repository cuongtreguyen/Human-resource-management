package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PositionListResponseDTO {
    private List<PositionListItemDTO> data;
    private boolean success;
}

