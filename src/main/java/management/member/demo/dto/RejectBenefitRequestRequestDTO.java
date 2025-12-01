package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectBenefitRequestRequestDTO {
    private String approverName;
    private String rejectReason;
}

