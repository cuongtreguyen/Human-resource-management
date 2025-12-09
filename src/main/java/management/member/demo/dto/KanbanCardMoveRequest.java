package management.member.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class KanbanCardMoveRequest {
    @NotNull(message = "List ID is required")
    private Long listId;

    @NotNull(message = "Position is required")
    private Double position;
}
