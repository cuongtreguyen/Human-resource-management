package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ApplicationListResponseDTO {
    private List<ApplicationListItemDTO> data;
    private boolean success;
}

