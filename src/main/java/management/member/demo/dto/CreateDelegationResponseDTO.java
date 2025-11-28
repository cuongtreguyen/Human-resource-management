package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDelegationResponseDTO {
    private String id;
    private String fromEmployeeId;
    private String toEmployeeId;
    private String status;
    private String message;
    private boolean success;
}

