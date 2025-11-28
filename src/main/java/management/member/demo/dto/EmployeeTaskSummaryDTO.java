package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeTaskSummaryDTO {
    private String employeeId;
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer inProgressTasks;
    private Integer overdueTasks;
    private Double averageCompletionTime;
    private Integer productivityScore;
    private Integer thisWeekTasks;
    private Integer nextWeekTasks;
}

