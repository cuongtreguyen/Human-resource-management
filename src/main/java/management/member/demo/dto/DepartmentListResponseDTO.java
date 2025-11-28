package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DepartmentListResponseDTO {
    private List<DepartmentDTO> data;
    private boolean success;
}

