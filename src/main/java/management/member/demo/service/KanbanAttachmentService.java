package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import management.member.demo.dto.KanbanAttachmentResponse;
import management.member.demo.entity.Employee;
import management.member.demo.entity.KanbanAttachment;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.User;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.KanbanAttachmentRepository;
import management.member.demo.repository.KanbanCardRepository;
import management.member.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class KanbanAttachmentService {

    private final KanbanAttachmentRepository attachmentRepository;
    private final KanbanCardRepository cardRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    private static final String S3_FOLDER = "kanban/attachments";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @Value("${aws.s3.enabled:true}")
    private boolean s3Enabled;

    /**
     * Lấy danh sách attachments của card
     */
    public List<KanbanAttachmentResponse> getAttachmentsByCardId(Long cardId) {
        if (!cardRepository.existsById(cardId)) {
            throw new ResourceNotFoundException("Card không tồn tại với ID: " + cardId);
        }

        return attachmentRepository.findByCardIdOrderByUploadedAtDesc(cardId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Upload attachment lên S3
     */
    public KanbanAttachmentResponse uploadAttachment(Long cardId, MultipartFile file) throws IOException {
        // Validate
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Kích thước file không được vượt quá 10MB");
        }

        // Tìm card
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card không tồn tại với ID: " + cardId));

        // Lấy employee hiện tại qua User
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Employee uploader = userRepository.findByEmail(currentEmail)
                .map(User::getEmployee)
                .orElse(null);

        // Upload lên S3
        String fileUrl;
        if (s3Enabled) {
            log.info("Uploading attachment to S3 for card {}", cardId);
            fileUrl = s3Service.uploadFile(file, S3_FOLDER);
        } else {
            // Fallback: trả về local path (không khuyến khích cho production)
            log.warn("S3 disabled, using placeholder URL");
            fileUrl = "/uploads/kanban/" + file.getOriginalFilename();
        }

        // Tạo record trong DB
        KanbanAttachment attachment = KanbanAttachment.builder()
                .card(card)
                .fileName(file.getOriginalFilename())
                .fileUrl(fileUrl)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .uploadedBy(uploader)
                .build();

        KanbanAttachment saved = attachmentRepository.save(attachment);

        // Update attachment count trên card
        card.setAttachmentCount(attachmentRepository.countByCardId(cardId));
        cardRepository.save(card);

        log.info("Attachment uploaded successfully: id={}, fileUrl={}", saved.getId(), fileUrl);
        return toResponse(saved);
    }

    /**
     * Lấy thông tin attachment theo ID
     */
    public KanbanAttachmentResponse getAttachmentById(Long attachmentId) {
        KanbanAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment không tồn tại với ID: " + attachmentId));
        return toResponse(attachment);
    }

    /**
     * Xóa attachment (từ S3 và DB)
     */
    public void deleteAttachment(Long attachmentId) {
        KanbanAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment không tồn tại với ID: " + attachmentId));

        Long cardId = attachment.getCard().getId();
        String fileUrl = attachment.getFileUrl();

        // Xóa file từ S3
        if (s3Enabled && fileUrl != null && fileUrl.contains("amazonaws.com")) {
            try {
                log.info("Deleting attachment from S3: {}", fileUrl);
                s3Service.deleteFile(fileUrl);
            } catch (Exception e) {
                log.error("Failed to delete file from S3: {}", e.getMessage());
                // Vẫn tiếp tục xóa record trong DB
            }
        }

        // Xóa record trong DB
        attachmentRepository.delete(attachment);

        // Update attachment count trên card
        KanbanCard card = cardRepository.findById(cardId).orElse(null);
        if (card != null) {
            card.setAttachmentCount(attachmentRepository.countByCardId(cardId));
            cardRepository.save(card);
        }

        log.info("Attachment deleted successfully: id={}", attachmentId);
    }

    /**
     * Lấy URL để download (có thể là presigned URL cho private bucket)
     */
    public String getDownloadUrl(Long attachmentId) {
        KanbanAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment không tồn tại với ID: " + attachmentId));

        String fileUrl = attachment.getFileUrl();

        // Nếu cần presigned URL (cho private bucket), gọi s3Service.getPresignedUrl()
        // Hiện tại trả về URL trực tiếp (bucket public)
        return fileUrl;
    }

    private KanbanAttachmentResponse toResponse(KanbanAttachment attachment) {
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
