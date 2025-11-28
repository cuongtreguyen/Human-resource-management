package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateLeaveResponseDTO {
    private String id;
    private String employeeId;
    private String message;
    private boolean success;
}

