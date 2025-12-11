package management.member.demo.validator;

import management.member.demo.dto.CreatePolicyRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class PolicyValidator {

    public void validateCreatePolicyRequest(CreatePolicyRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Policy request cannot be null");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Policy name is required");
        }

        if (request.getName().length() > 255) {
            throw ErrorCode.INVALID_REQUEST.toException("Policy name must not exceed 255 characters");
        }

        if (request.getType() == null || request.getType().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Policy type is required");
        }

        if (request.getEffectiveDate() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Effective date is required");
        }
    }
}

