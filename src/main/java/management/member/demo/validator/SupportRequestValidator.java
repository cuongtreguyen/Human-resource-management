package management.member.demo.validator;

import management.member.demo.dto.ProcessRequestDTO;
import management.member.demo.enums.SupportStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.repository.SupportRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SupportRequestValidator {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    public void validateProcessRequest(Long requestId, ProcessRequestDTO request) {
        if (requestId == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Support request ID is required");
        }

        if (!supportRequestRepository.existsById(requestId)) {
            throw ErrorCode.INVALID_REQUEST.toException("Support request not found with ID: " + requestId);
        }

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Process request cannot be null");
        }

        if (request.getStatus() != null) {
            try {
                SupportStatus.valueOf(request.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw ErrorCode.INVALID_REQUEST.toException("Invalid support status: " + request.getStatus());
            }
        }

        if (request.getManagerResponse() != null && request.getManagerResponse().length() > 2000) {
            throw ErrorCode.INVALID_REQUEST.toException("Manager response must not exceed 2000 characters");
        }
    }

    public void validateSupportRequestId(Long requestId) {
        if (requestId == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Support request ID is required");
        }

        if (!supportRequestRepository.existsById(requestId)) {
            throw ErrorCode.INVALID_REQUEST.toException("Support request not found with ID: " + requestId);
        }
    }
}

