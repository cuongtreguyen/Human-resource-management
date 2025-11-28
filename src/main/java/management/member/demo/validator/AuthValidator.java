package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class AuthValidator {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );
    private static final Pattern OTP_PATTERN = Pattern.compile("^[0-9]{6}$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^.{8,}$"); // Minimum 8 characters

    public void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw ErrorCode.INVALID_EMAIL.toException();
        }
        String trimmedEmail = email.trim();
        if (!EMAIL_PATTERN.matcher(trimmedEmail).matches()) {
            throw ErrorCode.INVALID_EMAIL_FORMAT.toException();
        }
    }

    public void validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw ErrorCode.INVALID_PASSWORD_FORMAT.toException("Mật khẩu không được để trống");
        }
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw ErrorCode.INVALID_PASSWORD_FORMAT.toException("Mật khẩu phải có ít nhất 8 ký tự");
        }
    }

    public void validateOtp(String otp) {
        if (otp == null || otp.trim().isEmpty()) {
            throw ErrorCode.INVALID_OTP_FORMAT.toException("OTP không được để trống");
        }
        String trimmedOtp = otp.trim();
        if (!OTP_PATTERN.matcher(trimmedOtp).matches()) {
            throw ErrorCode.INVALID_OTP_FORMAT.toException("OTP phải là 6 chữ số");
        }
    }
}

