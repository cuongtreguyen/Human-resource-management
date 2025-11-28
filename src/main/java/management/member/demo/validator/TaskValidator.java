package management.member.demo.validator;

import management.member.demo.Enum.TaskPriorityStatus;
import management.member.demo.Enum.TaskStatus;
import management.member.demo.dto.CreateTaskRequestDTO;
import management.member.demo.dto.UpdateTaskRequestDTO;
import management.member.demo.dto.UpdateTaskProgressRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Validator class - Chỉ chịu trách nhiệm validate Task data
 * Không chứa business logic hay logic lưu trữ
 */
@Component
public class TaskValidator {

    /**
     * Validate CreateTaskRequestDTO
     */
    public void validateCreateTaskRequest(CreateTaskRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate title
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tiêu đề công việc không được để trống");
        }

        // Validate assigneeId
        if (request.getAssigneeId() == null || request.getAssigneeId().trim().isEmpty()) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException();
        }
        validateAssigneeIdString(request.getAssigneeId());

        // Validate priority (optional)
        if (request.getPriority() != null && !request.getPriority().trim().isEmpty()) {
            validateTaskPriorityStatus(request.getPriority());
        }

        // Validate date range if both provided
        if (request.getStartDate() != null && request.getEndDate() != null) {
            validateDateRange(request.getStartDate(), request.getEndDate());
        }
    }

    /**
     * Validate UpdateTaskRequestDTO
     */
    public void validateUpdateTaskRequest(UpdateTaskRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate title if provided
        if (request.getTitle() != null && request.getTitle().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tiêu đề công việc không được để trống");
        }

        // AssigneeId is optional in update request, skip validation

        // Validate status if provided
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            validateTaskStatus(request.getStatus());
        }

        // Validate priority if provided
        if (request.getPriority() != null && !request.getPriority().trim().isEmpty()) {
            validateTaskPriorityStatus(request.getPriority());
        }

        // Validate date range if both provided
        if (request.getStartDate() != null && request.getEndDate() != null) {
            validateDateRange(request.getStartDate(), request.getEndDate());
        }
    }

    /**
     * Validate UpdateTaskProgressRequestDTO
     */
    public void validateUpdateTaskProgressRequest(UpdateTaskProgressRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Progress field may not exist in DTO, skip validation if not present
        // If progress is provided, it should be validated in Service or DTO level
    }

    /**
     * Validate task ID string
     */
    public void validateTaskIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("ID công việc không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_REQUEST.toException("ID công việc không hợp lệ: " + id);
        }
    }

    /**
     * Validate assignee ID string
     */
    public void validateAssigneeIdString(String assigneeId) {
        if (assigneeId == null || assigneeId.trim().isEmpty()) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException();
        }
        try {
            Long.parseLong(assigneeId.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException("ID người được giao không hợp lệ: " + assigneeId);
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
     * Validate TaskStatus enum value
     */
    public void validateTaskStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return; // Optional field
        }
        try {
            TaskStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException(
                "Trạng thái công việc không hợp lệ. Các giá trị hợp lệ: PENDING, IN_PROGRESS, COMPLETED, CANCELLED");
        }
    }

    /**
     * Validate TaskPriorityStatus enum value
     */
    public void validateTaskPriorityStatus(String priority) {
        if (priority == null || priority.trim().isEmpty()) {
            return; // Optional field
        }
        try {
            TaskPriorityStatus.valueOf(priority.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException(
                "Độ ưu tiên công việc không hợp lệ. Các giá trị hợp lệ: LOW, MEDIUM, HIGH, URGENT");
        }
    }
}

