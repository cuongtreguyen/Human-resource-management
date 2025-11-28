package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LeaveHistoryResponseDTO {
    private List<LeaveHistoryItemDTO> data;
    private boolean success;
    
    @Getter
    @Setter
    public static class LeaveHistoryItemDTO {
        private String id;
        private String type;
        private String startDate;
        private String endDate;
        private Integer days;
        private String status;
        private String approvedBy;
        private String approvedDate;
    }
}

