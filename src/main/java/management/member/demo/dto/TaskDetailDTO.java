package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskDetailDTO {
    private TaskDetailData data;
    private boolean success;

    @Getter
    @Setter
    public static class TaskDetailData {
        private Long id;
        private String title;
        private String description;
        private String status;
        private String priority;
        private AssigneeInfo assignee;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        private LocalDateTime createdAt;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        private LocalDateTime updatedAt;
    }
    
    @Getter
    @Setter
    public static class AssigneeInfo {
        private Long id;
        private String name;
        private String avatar;
    }
}
