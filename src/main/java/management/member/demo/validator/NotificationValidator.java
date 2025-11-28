package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class NotificationValidator {

    public void validateNotificationIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_NOTIFICATION_ID.toException("ID thông báo không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_NOTIFICATION_ID.toException("ID thông báo không hợp lệ: " + id);
        }
    }
}

