package management.member.demo.converter;

import management.member.demo.Enum.PayrollStatus;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

/**
 * Converter để convert String → PayrollStatus
 * Dùng cho @RequestParam và @PathVariable trong Controller
 * Ví dụ: GET /payrolls?status=PENDING hoặc GET /payrolls/status/PENDING
 */
@Component
public class PayrollStatusConverter implements Converter<String, PayrollStatus> {

    @Override
    public PayrollStatus convert(String source) {
        if (source == null || source.trim().isEmpty()) {
            throw ErrorCode.INVALID_PAYROLL_STATUS.toException();
        }
        try {
            return PayrollStatus.valueOf(source.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_PAYROLL_STATUS_VALUE.toException();
        }
    }
}

