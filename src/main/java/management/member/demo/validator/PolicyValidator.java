package management.member.demo.validator;

import management.member.demo.dto.CreatePolicyRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class PolicyValidator {

    public void validatePolicyIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_POLICY_ID.toException("ID chính sách không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_POLICY_ID.toException("ID chính sách không hợp lệ: " + id);
        }
    }

    public void validateCreatePolicyRequest(CreatePolicyRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw ErrorCode.INVALID_POLICY_NAME.toException();
        }
        if (request.getType() == null || request.getType().trim().isEmpty()) {
            throw ErrorCode.INVALID_POLICY_TYPE.toException();
        }
        // description và effectiveDate are optional
    }
}

