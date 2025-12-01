package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CalculateTaskMetricsResponseDTO {
    private MetricsData data;
    private boolean success;
    
    @Getter
    @Setter
    public static class MetricsData {
        private Integer totalEstimatedHours;
        private Integer totalActualHours;
        private BigDecimal totalCost;
        private Integer averageProgress;
        private Integer onTimeCompletion;
        private Integer overdueTasks;
        private Integer efficiencyScore;
        private List<String> recommendations;
    }
}

