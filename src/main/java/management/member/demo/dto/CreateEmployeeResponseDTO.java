package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEmployeeResponseDTO {
    private String id;  // employeeId or employeeCode
    private String name;  // fullName
    private String email;
    private String message;
    private boolean success = true;
}

