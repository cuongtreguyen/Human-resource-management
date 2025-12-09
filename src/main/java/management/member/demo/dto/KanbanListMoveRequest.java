package management.member.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class KanbanListMoveRequest {
    @NotNull(message = "Position is required")
    private Double position;
}
