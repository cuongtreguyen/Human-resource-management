package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskAnalyticsDTO {
    private AnalyticsData data;
    private boolean success;

    @Getter
    @Setter
    public static class AnalyticsData {
        private OverviewDTO overview;
        private ProductivityDTO productivity;
        
        // Flattened fields for compatibility with service mock
        private Integer totalTasks;
        private Integer completedTasks;
        private Integer inProgressTasks;
        private Integer pendingTasks;
        private Double completionRate;
    }
    
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

