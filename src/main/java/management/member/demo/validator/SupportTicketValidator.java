package management.member.demo.validator;

import management.member.demo.dto.CreateTicketRequestDTO;
import management.member.demo.dto.RespondToTicketRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

/**
 * Validator class - Chỉ chịu trách nhiệm validate SupportTicket data
 * Không chứa business logic hay logic lưu trữ
 */
@Component
public class SupportTicketValidator {

    /**
     * Validate CreateTicketRequestDTO
     */
    public void validateCreateTicketRequest(CreateTicketRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate subject
        if (request.getSubject() == null || request.getSubject().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tiêu đề ticket không được để trống");
        }

        // Validate category
        if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Danh mục ticket không được để trống");
        }

        // Validate priority
        if (request.getPriority() == null || request.getPriority().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Độ ưu tiên ticket không được để trống");
        }

        // Validate description
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Mô tả ticket không được để trống");
        }

        // Validate employeeId
        if (request.getEmployeeId() == null || request.getEmployeeId().trim().isEmpty()) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException();
        }
        validateEmployeeIdString(request.getEmployeeId());
    }

    /**
     * Validate RespondToTicketRequestDTO
     */
    public void validateRespondToTicketRequest(RespondToTicketRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate response
        if (request.getResponse() == null || request.getResponse().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Phản hồi ticket không được để trống");
        }
    }

    /**
     * Validate ticket ID string
     */
    public void validateTicketIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("ID ticket không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_REQUEST.toException("ID ticket không hợp lệ: " + id);
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
}

