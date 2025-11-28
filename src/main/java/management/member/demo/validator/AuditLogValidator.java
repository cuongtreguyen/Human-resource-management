package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Component
public class AuditLogValidator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_DATE;

    public LocalDate validateDateStringOptional(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr.trim(), DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            throw ErrorCode.INVALID_DATE_FORMAT.toException("Định dạng ngày không hợp lệ: " + dateStr + ". Định dạng yêu cầu: yyyy-MM-dd");
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

