package management.member.demo.mapper;

import management.member.demo.dto.KanbanActivityResponse;
import management.member.demo.entity.KanbanActivity;
import org.springframework.stereotype.Component;

@Component
public class KanbanActivityMapper {

    public KanbanActivityResponse toResponse(KanbanActivity activity) {
        return KanbanActivityResponse.builder()
                .id(activity.getId())
                .cardId(activity.getCard() != null ? activity.getCard().getId() : null)
                .cardTitle(activity.getCard() != null ? activity.getCard().getTitle() : null)
                .boardId(activity.getBoard() != null ? activity.getBoard().getId() : null)
                .actorId(activity.getActor() != null ? activity.getActor().getId() : null)
                .actorName(activity.getActor() != null ? activity.getActor().getFullName() : null)
                .actorAvatar(null) // Employee entity không có field avatar
                .action(activity.getAction())
                .description(activity.getDescription())
                .oldValue(activity.getOldValue())
                .newValue(activity.getNewValue())
                .createdAt(activity.getCreatedAt())
                .build();
    }
}

