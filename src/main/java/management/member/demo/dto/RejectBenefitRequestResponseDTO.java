package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectBenefitRequestResponseDTO {
    private BenefitRequestData data;
    private boolean success;
    private String message;
    
    @Getter
    @Setter
    public static class BenefitRequestData {
        private String id;
        private String status;
        private String rejectedBy;
        private String rejectedDate;
        private String rejectReason;
    }
}

