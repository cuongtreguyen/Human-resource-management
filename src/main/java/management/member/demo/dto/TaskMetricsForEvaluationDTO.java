package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskMetricsForEvaluationDTO {
    private MetricsData data;
    private boolean success;

    @Getter
    @Setter
    public static class MetricsData {
        private String employeeId;
        private StatsDTO stats;
        private Double completionRate;
        private Double onTimeCompletionRate; // Renamed from onTimeRate to match service mock
        private Double averageCompletionTime; // Added to match service mock
        private Double highPriorityRate;
        private Integer productivityScore;
    }
    
    @Getter
    @Setter
    public static class StatsDTO {
        private Integer total;
        private Integer todo;
        private Integer inProgress;
        private Integer review;
        private Integer done;
    }
}

