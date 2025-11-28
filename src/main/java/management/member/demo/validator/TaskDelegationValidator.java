package management.member.demo.validator;

import management.member.demo.dto.CreateDelegationRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class TaskDelegationValidator {

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

    public void validateDelegationIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_DELEGATION_ID.toException("ID ủy quyền không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_DELEGATION_ID.toException("ID ủy quyền không hợp lệ: " + id);
        }
    }

    public void validateCreateDelegationRequest(CreateDelegationRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
        validateEmployeeIdString(request.getFromEmployeeId());
        validateEmployeeIdString(request.getToEmployeeId());
        if (request.getTaskIds() == null || request.getTaskIds().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Danh sách task IDs không được để trống");
        }
    }
}

