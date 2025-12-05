package management.member.demo.validator;

import management.member.demo.enums.TaskPriorityStatus;
import management.member.demo.enums.TaskStatus;
import management.member.demo.dto.CreateTaskRequestDTO;
import management.member.demo.dto.UpdateTaskRequestDTO;
import management.member.demo.dto.UpdateTaskProgressRequestDTO;
import management.member.demo.enums.TaskTag;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;
import java.time.LocalDate;


@Component
public class TaskValidator {

    public void validateCreateTaskRequest(CreateTaskRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // 1. Validate Title
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tiêu đề công việc không được để trống");
        }

        // 5. Validate Board ID (Optional - nếu bắt buộc thì thêm check)
        if (request.getBoardId() != null && request.getBoardId() <= 0) {
            throw ErrorCode.INVALID_REQUEST.toException("Board ID không hợp lệ");
        }
    }

    /**
     * Validate UpdateTaskRequestDTO
     * Logic Mới: Thêm check Tag, AssigneeIds
     */
    public void validateUpdateTaskRequest(UpdateTaskRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // 1. Validate Title (Nếu có update)
        if (request.getTitle() != null && request.getTitle().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tiêu đề công việc không được để trống");
        }

        // 2. Validate Status
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            validateTaskStatus(request.getStatus());
        }

        // 3. Validate Priority
        if (request.getPriority() != null && !request.getPriority().trim().isEmpty()) {
            validateTaskPriorityStatus(request.getPriority());
        }

        // 4. Validate Tag (MỚI)
        if (request.getTag() != null && !request.getTag().trim().isEmpty()) {
            validateTaskTag(request.getTag());
        }

        // 5. Validate Assignee IDs (MỚI - Trong update mới có thêm người)
        if (request.getAssigneeIds() != null) {
            for (Long id : request.getAssigneeIds()) {
                if (id == null || id <= 0) {
                    throw ErrorCode.INVALID_EMPLOYEE_ID.toException("Danh sách người thực hiện chứa ID không hợp lệ");
                }
            }
        }

        // Lưu ý: DTO Update chỉ có 'deadline', không có startDate/endDate nên không gọi validateDateRange ở đây nữa.
        // Nếu muốn check deadline không được là ngày quá khứ thì thêm logic tại đây.
    }
    public void validateUpdateTaskProgressRequest(UpdateTaskProgressRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
        // Validate % progress (0-100)
        if (request.getCurrentProgress() < 0 || request.getCurrentProgress() > 100) {
            throw ErrorCode.INVALID_REQUEST.toException("Tiến độ phải từ 0 đến 100%");
        }
    }

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

    public void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && !endDate.isAfter(startDate) && !endDate.isEqual(startDate)) {
            throw ErrorCode.INVALID_DATE_RANGE.toException("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
        }
    }

    public void validateTaskStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return;
        }
        try {
            // Replace "-" with "_" to match Enum (e.g. IN-PROGRESS -> IN_PROGRESS)
            TaskStatus.valueOf(status.trim().toUpperCase().replace("-", "_"));
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException(
                    "Trạng thái công việc không hợp lệ.");
        }
    }

    public void validateTaskPriorityStatus(String priority) {
        if (priority == null || priority.trim().isEmpty()) {
            return;
        }
        try {
            TaskPriorityStatus.valueOf(priority.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException(
                    "Độ ưu tiên công việc không hợp lệ (LOW, MEDIUM, HIGH, URGENT)");
        }
    }

    // Hàm Validate Tag Mới
    public void validateTaskTag(String tag) {
        if (tag == null || tag.trim().isEmpty()) return;
        try {
            TaskTag.valueOf(tag.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException("Nhãn (Tag) không hợp lệ (BUG, FEATURE, IMPROVEMENT, DOCUMENTATION)");
        }
    }

}
