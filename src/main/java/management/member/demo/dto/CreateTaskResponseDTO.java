package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateTaskResponseDTO {
    private TaskData data;
    private String message;
    private boolean success;

    @Getter
    @Setter
    public static class TaskData {
        private String id;
        private String title;
        private String status; // "new", "in-progress", "pending", "complete"
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        private LocalDateTime createdAt;
    }
}

