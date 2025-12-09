package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.enums.KanbanCardPriority;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KanbanCardResponse {
    private Long id;
    private Long listId;
    private String title;
    private String description;
    private Double position;
    private KanbanCardPriority priority;
    private LocalDateTime dueDate;
    private List<Long> assigneeIds;
    private List<Long> labelIds;
    private int attachmentCount;
    private int commentCount;
    private String checkItemStatus;
    private boolean archived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
