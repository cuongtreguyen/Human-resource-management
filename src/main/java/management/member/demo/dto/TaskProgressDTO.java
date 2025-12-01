package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TaskProgressDTO {
    private TaskProgressData data;
    private boolean success;

    @Getter
    @Setter
    public static class TaskProgressData {
        private Long taskId;
        private Integer currentProgress;
        private Integer timeSpent;
        private Integer estimatedTime;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        private LocalDateTime lastUpdate;
        
        private List<MilestoneDTO> milestones;
    }
    
    @Getter
    @Setter
    public static class MilestoneDTO {
        private Long id;
        private String name;
        private Boolean completed;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        private LocalDateTime completedAt;
    }
}
