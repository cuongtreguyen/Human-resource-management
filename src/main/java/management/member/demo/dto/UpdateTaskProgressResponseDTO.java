package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTaskProgressResponseDTO {
    private TaskProgressData data;
    private String message;
    private boolean success;

    @Getter
    @Setter
    public static class TaskProgressData {
        private Long taskId;
        private Integer currentProgress;
        
        @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        private java.time.LocalDateTime lastUpdate;
    }
}

