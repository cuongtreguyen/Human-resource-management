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
public class KanbanActivityResponse {
    private Long id;
    private Long cardId;
    private String cardTitle;
    private Long boardId;
    private Long actorId;
    private String actorName;
    private String actorAvatar;
    private String action;
    private String description;
    private String oldValue;
    private String newValue;
    private LocalDateTime createdAt;
}
