package management.member.demo.dto;

import lombok.Data;
import management.member.demo.enums.KanbanCardPriority;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class KanbanCardUpdateRequest {
    private String title;
    private String description;
    private KanbanCardPriority priority;
    private LocalDateTime dueDate;
    private LocalDateTime reminderDate;
    private List<Long> assigneeIds;
    private List<Long> labelIds;
}
