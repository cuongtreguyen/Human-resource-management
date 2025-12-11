package management.member.demo.mapper;

import management.member.demo.dto.KanbanCardResponse;
import management.member.demo.dto.KanbanListResponse;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.KanbanList;
import org.springframework.stereotype.Component;

@Component
public class KanbanListMapper {

    private final KanbanCardMapper kanbanCardMapper;

    public KanbanListMapper(KanbanCardMapper kanbanCardMapper) {
        this.kanbanCardMapper = kanbanCardMapper;
    }

    public KanbanListResponse toResponse(KanbanList list) {
        return KanbanListResponse.builder()
                .id(list.getId())
                .boardId(list.getBoard().getId())
                .name(list.getName())
                .position(list.getPosition())
                .archived(list.isArchived())
                .build();
    }

    public KanbanCardResponse toCardResponse(KanbanCard card) {
        return kanbanCardMapper.toResponse(card);
    }
}

