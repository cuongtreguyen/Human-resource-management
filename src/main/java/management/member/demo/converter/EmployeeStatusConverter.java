package management.member.demo.converter;

import management.member.demo.Enum.EmployeeStatus;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class EmployeeStatusConverter implements Converter<String, EmployeeStatus> {

    @Override
    public EmployeeStatus convert(String source) {
        if (source == null || source.trim().isEmpty()) {
            throw ErrorCode.INVALID_STATUS.toException();
        }
        try {
            return EmployeeStatus.valueOf(source.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException();
        }
    }
}


