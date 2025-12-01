package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateLeaveStatusResponseDTO {
    private LeaveStatusData data;
    private String message;
    private boolean success;

    @Getter
    @Setter
    public static class LeaveStatusData {
        private String id;
        private String status;
        private String approvedBy; // Optional
    }
}

