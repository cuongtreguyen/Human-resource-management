package management.member.demo.mapper;

import management.member.demo.dto.KanbanAttachmentResponse;
import management.member.demo.entity.KanbanAttachment;
import org.springframework.stereotype.Component;

@Component
public class KanbanAttachmentMapper {

    public KanbanAttachmentResponse toResponse(KanbanAttachment attachment) {
        return KanbanAttachmentResponse.builder()
                .id(attachment.getId())
                .cardId(attachment.getCard().getId())
                .fileName(attachment.getFileName())
                .fileUrl(attachment.getFileUrl())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .uploadedById(attachment.getUploadedBy() != null ? attachment.getUploadedBy().getId() : null)
                .uploadedByName(attachment.getUploadedBy() != null ? attachment.getUploadedBy().getFullName() : null)
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }
}

