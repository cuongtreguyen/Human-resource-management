package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateLeaveStatusRequestDTO {
    private String status; // "approved", "rejected"
    private String approvedBy; // Optional
    private String comments; // Optional
}

