package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KanbanListResponse {
    private Long id;
    private Long boardId;
    private String name;
    private Double position;
    private boolean archived;
    private int cardCount;
    private List<KanbanCardResponse> cards;
}
