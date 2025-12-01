package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTaskResponseDTO {
    private TaskData data;
    private String message;
    private boolean success;

    @Getter
    @Setter
    public static class TaskData {
        private Long id;
        private String status;
        
        @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        private java.time.LocalDateTime updatedAt;
    }
}

