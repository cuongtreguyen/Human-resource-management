package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmployeeTrainingResponseDTO {
    private List<TrainingItemDTO> trainings;
    private TrainingSummaryDTO summary;
    private boolean success;
    
    @Getter
    @Setter
    public static class TrainingSummaryDTO {
        private Integer completed;
        private Integer inProgress;
        private Integer registered;
        private Integer totalHours;
        private Integer certificates;
    }
}

