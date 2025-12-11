package management.member.demo.validator;

import management.member.demo.dto.CreateDelegationRequestDTO;
import management.member.demo.dto.RejectDelegationRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.TaskDelegationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TaskDelegationValidator {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TaskDelegationRepository delegationRepository;

    public void validateCreateDelegationRequest(CreateDelegationRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Delegation request cannot be null");
        }

        if (request.getFromEmployeeId() == null || request.getFromEmployeeId().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("From employee ID is required");
        }

        if (request.getToEmployeeId() == null || request.getToEmployeeId().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("To employee ID is required");
        }

        // Validate employee IDs exist
        try {
            Long fromId = Long.parseLong(request.getFromEmployeeId());
            if (!employeeRepository.existsById(fromId)) {
                throw ErrorCode.EMPLOYEE_NOT_FOUND.toException("From employee not found with ID: " + request.getFromEmployeeId());
            }
        } catch (NumberFormatException e) {
            // Try to find by employeeId
            if (!employeeRepository.findByEmployeeId(request.getFromEmployeeId()).isPresent()) {
                throw ErrorCode.EMPLOYEE_NOT_FOUND.toException("From employee not found with ID: " + request.getFromEmployeeId());
            }
        }

        try {
            Long toId = Long.parseLong(request.getToEmployeeId());
            if (!employeeRepository.existsById(toId)) {
                throw ErrorCode.EMPLOYEE_NOT_FOUND.toException("To employee not found with ID: " + request.getToEmployeeId());
            }
        } catch (NumberFormatException e) {
            // Try to find by employeeId
            if (!employeeRepository.findByEmployeeId(request.getToEmployeeId()).isPresent()) {
                throw ErrorCode.EMPLOYEE_NOT_FOUND.toException("To employee not found with ID: " + request.getToEmployeeId());
            }
        }

        if (request.getFromEmployeeId().equals(request.getToEmployeeId())) {
            throw ErrorCode.INVALID_REQUEST.toException("From employee and To employee cannot be the same");
        }

        if (request.getTaskIds() == null || request.getTaskIds().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Task IDs are required");
        }

        if (request.getStartDate() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Start date is required");
        }

        if (request.getEndDate() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("End date is required");
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw ErrorCode.INVALID_REQUEST.toException("Start date must be before or equal to end date");
        }
    }

    public void validateDelegationId(String delegationId) {
        if (delegationId == null || delegationId.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Delegation ID is required");
        }

        try {
            Long id = Long.parseLong(delegationId);
            if (!delegationRepository.existsById(id)) {
                throw ErrorCode.INVALID_REQUEST.toException("Delegation not found with ID: " + delegationId);
            }
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_REQUEST.toException("Invalid delegation ID format: " + delegationId);
        }
    }

    public void validateRejectDelegationRequest(RejectDelegationRequestDTO request) {
        if (request != null && request.getReason() != null && request.getReason().length() > 1000) {
            throw ErrorCode.INVALID_REQUEST.toException("Rejection reason must not exceed 1000 characters");
        }
    }
}

