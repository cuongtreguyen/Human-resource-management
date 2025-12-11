package management.member.demo.validator;

import management.member.demo.dto.CommentRequest;
import management.member.demo.dto.CommentUpdateRequest;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

/**
 * Validator class - Chỉ chịu trách nhiệm validate Comment data
 * Không chứa business logic hay logic lưu trữ
 */
@Component
public class CommentValidator {

    /**
     * Validate CommentRequest
     */
    public void validateCommentRequest(CommentRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate content
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Nội dung comment không được để trống");
        }
        validateContent(request.getContent());

        // Validate taskId
        if (request.getTaskId() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Task ID không được để trống");
        }
    }

    /**
     * Validate CommentUpdateRequest
     */
    public void validateCommentUpdateRequest(CommentUpdateRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate content
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Nội dung comment không được để trống");
        }
        validateContent(request.getContent());
    }

    /**
     * Validate content - không được để trống và có độ dài hợp lý
     */
    public void validateContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Nội dung comment không được để trống");
        }
        if (content.length() > 5000) {
            throw ErrorCode.INVALID_REQUEST.toException("Nội dung comment không được vượt quá 5000 ký tự");
        }
    }

    /**
     * Validate comment ID
     */
    public void validateCommentId(Long id) {
        if (id == null) {
            throw ErrorCode.COMMENT_NOT_FOUND.toException("ID comment không được để trống");
        }
    }

    /**
     * Validate content for card comment
     */
    public void validateCardCommentContent(String content) {
        validateContent(content);
    }

    /**
     * Validate card ID
     */
    public void validateCardId(Long cardId) {
        if (cardId == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Card ID không được để trống");
        }
    }
}

