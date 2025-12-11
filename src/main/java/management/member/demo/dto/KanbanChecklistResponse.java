package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KanbanChecklistResponse {
    private Long id;
    private Long cardId;
    private String title;
    private boolean completed;
    private Integer position;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
