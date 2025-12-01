package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmployeeDocumentListResponseDTO {
    private List<EmployeeDocumentDTO> data;
    private boolean success;
}

