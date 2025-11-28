package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class ChatValidator {

    public void validateContactIdString(String contactId) {
        if (contactId == null || contactId.trim().isEmpty()) {
            throw ErrorCode.INVALID_CHAT_CONTACT_ID.toException("ID liên hệ chat không được để trống");
        }
        try {
            Long.parseLong(contactId.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_CHAT_CONTACT_ID.toException("ID liên hệ chat không hợp lệ: " + contactId);
        }
    }

    public void validatePageNumber(Integer page) {
        if (page != null && page < 0) {
            throw ErrorCode.INVALID_PAGE_NUMBER.toException("Số trang phải >= 0");
        }
    }

    public void validatePageSize(Integer size) {
        if (size != null && size <= 0) {
            throw ErrorCode.INVALID_PAGE_SIZE.toException("Kích thước trang phải > 0");
        }
    }

    public void validatePagination(Integer page, Integer size) {
        validatePageNumber(page);
        validatePageSize(size);
    }
}

