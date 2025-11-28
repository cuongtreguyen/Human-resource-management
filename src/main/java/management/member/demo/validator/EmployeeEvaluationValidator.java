package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class EmployeeEvaluationValidator {

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

    public Long validateEmployeeIdStringOptional(String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            return null;
        }
        validateEmployeeIdString(employeeId);
        return Long.parseLong(employeeId.trim());
    }

    public void validateEvaluationIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_EVALUATION_ID.toException("ID đánh giá không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_EVALUATION_ID.toException("ID đánh giá không hợp lệ: " + id);
        }
    }
}

