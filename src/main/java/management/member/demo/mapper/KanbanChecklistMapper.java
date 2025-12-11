package management.member.demo.mapper;

import management.member.demo.dto.KanbanChecklistResponse;
import management.member.demo.entity.KanbanChecklist;
import org.springframework.stereotype.Component;

@Component
public class KanbanChecklistMapper {

    public KanbanChecklistResponse toResponse(KanbanChecklist checklist) {
        return KanbanChecklistResponse.builder()
                .id(checklist.getId())
                .cardId(checklist.getCard().getId())
                .title(checklist.getTitle())
                .completed(checklist.isCompleted())
                .position(checklist.getPosition())
                .createdAt(checklist.getCreatedAt())
                .updatedAt(checklist.getUpdatedAt())
                .build();
    }
}

