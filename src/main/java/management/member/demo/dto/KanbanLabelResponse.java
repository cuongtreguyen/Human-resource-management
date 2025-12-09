package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.entity.KanbanLabel;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KanbanLabelResponse {

    private Long id;
    private Long boardId;
    private String name;
    private String color;

    public static KanbanLabelResponse fromEntity(KanbanLabel label) {
        return KanbanLabelResponse.builder()
                .id(label.getId())
                .boardId(label.getBoard().getId())
                .name(label.getName())
                .color(label.getColor())
                .build();
    }
}
