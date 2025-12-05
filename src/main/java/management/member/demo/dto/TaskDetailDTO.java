package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

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

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        private LocalDateTime createdAt;

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        private LocalDateTime updatedAt;
        private String tag;
        private Long boardId;
        private String boardName;
        private List<CommentResponse> comments; // Cần tái sử dụng CommentResponse ở bài trước
        private List<AssigneeInfo> assignees;
    }

    @Getter
    @Setter
    public static class AssigneeInfo {
        private Long id;
        private String name;
    }
}