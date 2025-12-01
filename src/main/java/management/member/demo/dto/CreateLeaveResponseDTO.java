package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateLeaveResponseDTO {
    private LeaveData data;
    private String message;
    private boolean success;

    @Getter
    @Setter
    public static class LeaveData {
        private String id;
        private String employeeId;
        private String type; // "annual", "sick", "unpaid", "special"
        
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate startDate;
        
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate endDate;
        
        private Integer days; // Number of days
        private String status; // "pending", "approved", "rejected", "cancelled"
        
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate submittedDate;
    }
}

