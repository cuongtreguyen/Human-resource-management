package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBenefitRequestResponseDTO {
    private String id;
    private String employeeId;
    private String status;
    private String message;
    private boolean success;
}

