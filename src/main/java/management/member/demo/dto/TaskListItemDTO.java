package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class TaskListItemDTO {
    private String id; // Task ID as string
    private String title;
    private String description;
    private String status; // "new", "in-progress", "pending", "complete"
    private String priority; // "high", "medium", "low"
    private AssigneeInfo assignee;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime updatedAt;
    
    @Getter
    @Setter
    public static class AssigneeInfo {
        private String id;
        private String name;
        private String avatar;
    }
}

