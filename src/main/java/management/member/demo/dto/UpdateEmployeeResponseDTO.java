package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEmployeeResponseDTO {
    private EmployeeData data;
    private boolean success = true;
    private String message;

    @Getter
    @Setter
    public static class EmployeeData {
        private String id;  // employeeId or employeeCode
        private String name;  // fullName
    }
}

