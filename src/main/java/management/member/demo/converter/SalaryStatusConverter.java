package management.member.demo.converter;

import management.member.demo.Enum.SalaryStatus;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

/**
 * Converter để convert String → SalaryStatus
 * Dùng cho @RequestParam và @PathVariable trong Controller
 * Ví dụ: GET /salary?status=AWAITING hoặc GET /salary/status/AWAITING
 */
@Component
public class SalaryStatusConverter implements Converter<String, SalaryStatus> {

    @Override
    public SalaryStatus convert(String source) {
        if (source == null || source.trim().isEmpty()) {
            throw ErrorCode.INVALID_SALARY_STATUS.toException();
        }
        try {
            return SalaryStatus.valueOf(source.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_SALARY_STATUS_VALUE.toException();
        }
    }
}

