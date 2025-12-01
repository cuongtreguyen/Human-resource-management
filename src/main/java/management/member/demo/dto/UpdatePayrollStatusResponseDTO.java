package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePayrollStatusResponseDTO {
    private PayrollStatusData data;
    private String message;
    private boolean success;

    @Getter
    @Setter
    public static class PayrollStatusData {
        private String id;
        private String status;
    }
}

