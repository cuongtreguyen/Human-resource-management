package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveBalanceResponseDTO {
    private String employeeId;
    private Integer year;
    private LeaveTypeBalance annual;
    private LeaveTypeBalance sick;
    
    @Getter
    @Setter
    public static class LeaveTypeBalance {
        private Integer total;
        private Integer used;
        private Integer pending;
        private Integer remaining;
    }
}

