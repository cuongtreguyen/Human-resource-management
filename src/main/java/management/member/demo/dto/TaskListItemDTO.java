package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TaskListItemDTO {
    private Long id; // Task ID as number (Frontend expects number)
    private String title;
    private String description;
    private String status; // "new", "in-progress", "pending", "complete"
    private String priority; // "high", "medium", "low"

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime updatedAt;
    private String tag;
    private String boardName;
    private Long boardId;
    private int commentCount;
    private List<AssigneeInfo> assignees;

    @Getter
    @Setter
    public static class AssigneeInfo {
        private Long id; // Employee ID as number (Frontend expects number)
        private String name;
    }
}
