package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class BenefitsValidator {

    public void validateEmployeeIdString(String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException("ID nhân viên không được để trống");
        }
        try {
            Long.parseLong(employeeId.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException("ID nhân viên không hợp lệ: " + employeeId);
        }
    }
}

