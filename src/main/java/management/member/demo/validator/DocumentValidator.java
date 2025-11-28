package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Validator class - Chỉ chịu trách nhiệm validate Document data
 * Không chứa business logic hay logic lưu trữ
 */
@Component
public class DocumentValidator {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String[] ALLOWED_EXTENSIONS = {
        "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "jpg", "jpeg", "png"
    };

    /**
     * Validate document ID string
     */
    public void validateDocumentIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("ID tài liệu không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_REQUEST.toException("ID tài liệu không hợp lệ: " + id);
        }
    }

    /**
     * Validate file upload
     */
    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("File không được để trống");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw ErrorCode.INVALID_REQUEST.toException("Kích thước file không được vượt quá 10MB");
        }

        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tên file không hợp lệ");
        }

        String extension = getFileExtension(originalFilename);
        if (extension == null || !isAllowedExtension(extension)) {
            throw ErrorCode.INVALID_REQUEST.toException(
                "Định dạng file không được hỗ trợ. Các định dạng hợp lệ: " + String.join(", ", ALLOWED_EXTENSIONS));
        }
    }

    /**
     * Validate document name
     */
    public void validateDocumentName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tên tài liệu không được để trống");
        }
        if (name.trim().length() > 255) {
            throw ErrorCode.INVALID_REQUEST.toException("Tên tài liệu không được vượt quá 255 ký tự");
        }
    }

    /**
     * Validate document category
     */
    public void validateDocumentCategory(String category) {
        if (category != null && category.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Danh mục tài liệu không được để trống nếu đã cung cấp");
        }
    }

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return null;
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    /**
     * Check if extension is allowed
     */
    private boolean isAllowedExtension(String extension) {
        for (String allowed : ALLOWED_EXTENSIONS) {
            if (allowed.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }
}

