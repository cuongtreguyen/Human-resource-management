package management.member.demo.validator;

import management.member.demo.Enum.OnLeaveStatus;
import management.member.demo.Enum.OnLeaveType;
import management.member.demo.dto.CreateLeaveRequestDTO;
import management.member.demo.dto.UpdateLeaveStatusRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Validator class - Chỉ chịu trách nhiệm validate OnLeave data
 * Không chứa business logic hay logic lưu trữ
 */
@Component
public class OnLeaveValidator {

    /**
     * Validate CreateLeaveRequestDTO
     */
    public void validateCreateLeaveRequest(CreateLeaveRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate employeeId
        if (request.getEmployeeId() == null || request.getEmployeeId().trim().isEmpty()) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException();
        }
        validateEmployeeIdString(request.getEmployeeId());

        // Validate startDate
        if (request.getStartDate() == null) {
            throw ErrorCode.INVALID_HIRE_DATE.toException("Ngày bắt đầu nghỉ không được để trống");
        }

        // Validate endDate
        if (request.getEndDate() == null) {
            throw ErrorCode.INVALID_HIRE_DATE.toException("Ngày kết thúc nghỉ không được để trống");
        }

        // Validate date range
        validateDateRange(request.getStartDate(), request.getEndDate());

        // Validate type
        if (request.getType() != null && !request.getType().trim().isEmpty()) {
            validateOnLeaveType(request.getType());
        }

        // Validate reason (optional but if provided should not be empty)
        if (request.getReason() != null && request.getReason().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Lý do nghỉ không được để trống nếu đã cung cấp");
        }
    }

    /**
     * Validate UpdateLeaveStatusRequestDTO
     */
    public void validateUpdateLeaveStatusRequest(UpdateLeaveStatusRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate status
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            throw ErrorCode.INVALID_STATUS.toException();
        }
        validateOnLeaveStatus(request.getStatus());
    }

    /**
     * Validate leave ID string
     */
    public void validateLeaveIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("ID nghỉ phép không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_REQUEST.toException("ID nghỉ phép không hợp lệ: " + id);
        }
    }

    /**
     * Validate employee ID string
     */
    public void validateEmployeeIdString(String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException();
        }
        try {
            Long.parseLong(employeeId.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException("ID nhân viên không hợp lệ: " + employeeId);
        }
    }

    /**
     * Validate date range - endDate phải sau startDate
     */
    public void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && !endDate.isAfter(startDate) && !endDate.isEqual(startDate)) {
            throw ErrorCode.INVALID_DATE_RANGE.toException("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
        }
    }

    /**
     * Validate OnLeaveType enum value
     */
    public void validateOnLeaveType(String type) {
        if (type == null || type.trim().isEmpty()) {
            return; // Optional field
        }
        try {
            OnLeaveType.valueOf(type.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException(
                "Loại nghỉ phép không hợp lệ. Các giá trị hợp lệ: ANNUAL, SICK, PERSONAL, MATERNITY, PATERNITY, UNPAID");
        }
    }

    /**
     * Validate OnLeaveStatus enum value
     */
    public void validateOnLeaveStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw ErrorCode.INVALID_STATUS.toException();
        }
        try {
            OnLeaveStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException(
                "Trạng thái nghỉ phép không hợp lệ. Các giá trị hợp lệ: PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED");
        }
    }
}

