package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskAnalyticsDTO {
    private OverviewDTO overview;
    private ProductivityDTO productivity;
    private boolean success;
    
    @Getter
    @Setter
    public static class OverviewDTO {
        private Integer totalTasks;
        private Integer completedTasks;
        private Integer inProgressTasks;
        private Integer overdueTasks;
        private Double completionRate;
    }
    
    @Getter
    @Setter
    public static class ProductivityDTO {
        private Double averageCompletionTime;
        private Double tasksPerEmployee;
        private Integer efficiencyScore;
    }
}

