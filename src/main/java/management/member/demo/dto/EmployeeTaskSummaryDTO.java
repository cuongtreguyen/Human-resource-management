package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeTaskSummaryDTO {
    private SummaryData data;
    private boolean success;

    @Getter
    @Setter
    public static class SummaryData {
        private String employeeId;
        private Long totalTasks;
        private Long completedTasks;
        private Long inProgressTasks;
        private Long pendingTasks;
        private Double averageCompletionTime;
        private Integer productivityScore;
        private Integer thisWeekTasks;
        private Integer nextWeekTasks;
    }
}
