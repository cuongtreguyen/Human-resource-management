package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmployeePerformanceDTO {
    private String employeeId;
    private String period;
    private Double overallRating;
    private PerformanceRatingsDTO ratings;
    private List<String> achievements;
    private List<String> areasForImprovement;
    private List<GoalDTO> goals;
    private String managerFeedback;
    private String nextReviewDate;
    
    @Getter
    @Setter
    public static class PerformanceRatingsDTO {
        private Double quality;
        private Double productivity;
        private Double teamwork;
        private Double communication;
        private Double innovation;
    }
    
    @Getter
    @Setter
    public static class GoalDTO {
        private Long id;
        private String description;
        private Integer progress;
        private String dueDate;
    }
}

