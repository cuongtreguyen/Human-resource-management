package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteEmployeeResponseDTO {
    private String id;  // employeeId
    private String message;
    private boolean success = true;
}

