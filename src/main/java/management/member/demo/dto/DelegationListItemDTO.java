package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class DelegationListItemDTO {
    private String id;
    private EmployeeInfo fromEmployee;
    private EmployeeInfo toEmployee;
    private List<TaskInfo> tasks;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    
    private String reason;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdAt;
    
    @Getter
    @Setter
    public static class EmployeeInfo {
        private String id;
        private String name;
    }
    
    @Getter
    @Setter
    public static class TaskInfo {
        private String id;
        private String title;
    }
}

