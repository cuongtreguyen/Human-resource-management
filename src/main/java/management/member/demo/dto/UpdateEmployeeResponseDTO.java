package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEmployeeResponseDTO {
    private String id;  // employeeId or employeeCode
    private String message;
    private boolean success = true;
}

