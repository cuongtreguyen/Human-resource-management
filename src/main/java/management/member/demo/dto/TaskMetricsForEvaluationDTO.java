package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskMetricsForEvaluationDTO {
    private StatsDTO stats;
    private Double completionRate;
    private Double onTimeRate;
    private Double highPriorityRate;
    private Integer productivityScore;
    private boolean success;
    
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

