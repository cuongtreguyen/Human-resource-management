package management.member.demo.mapper;

import management.member.demo.dto.KanbanCardResponse;
import management.member.demo.entity.KanbanCard;
import org.springframework.stereotype.Component;

@Component
public class KanbanCardMapper {

    public KanbanCardResponse toResponse(KanbanCard card) {
        return KanbanCardResponse.builder()
                .id(card.getId())
                .listId(card.getList().getId())
                .title(card.getTitle())
                .description(card.getDescription())
                .position(card.getPosition())
                .priority(card.getPriority())
                .dueDate(card.getDueDate())
                .assigneeIds(card.getAssigneeIds())
                .labelIds(card.getLabelIds())
                .attachmentCount(card.getAttachmentCount())
                .commentCount(card.getCommentCount())
                .checkItemStatus(card.getCheckItemStatus())
                .archived(card.isArchived())
                .createdAt(card.getCreatedAt())
                .updatedAt(card.getUpdatedAt())
                .build();
    }
}

