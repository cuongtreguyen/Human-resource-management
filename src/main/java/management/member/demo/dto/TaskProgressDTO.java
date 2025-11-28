package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TaskProgressDTO {
    private String taskId;
    private Integer currentProgress;
    private List<MilestoneDTO> milestones;
    private Integer timeSpent; // hours
    private Integer estimatedTime; // hours
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime lastUpdate;
    
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

