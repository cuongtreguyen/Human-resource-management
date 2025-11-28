package management.member.demo.validator;

import management.member.demo.Enum.Role;
import management.member.demo.dto.CreateUserRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Validator class - Chỉ chịu trách nhiệm validate UserManagement data
 * Không chứa business logic hay logic lưu trữ
 */
@Component
public class UserManagementValidator {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    /**
     * Validate CreateUserRequestDTO
     */
    public void validateCreateUserRequest(CreateUserRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate username
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tên đăng nhập không được để trống");
        }
        validateUsername(request.getUsername());

        // Validate email
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw ErrorCode.INVALID_EMAIL.toException();
        }
        validateEmail(request.getEmail());

        // Validate password
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Mật khẩu không được để trống");
        }
        validatePassword(request.getPassword());

        // Validate role
        if (request.getRole() == null || request.getRole().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Vai trò không được để trống");
        }
        validateRole(request.getRole());
    }

    /**
     * Validate username
     */
    public void validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tên đăng nhập không được để trống");
        }
        String trimmed = username.trim();
        if (trimmed.length() < 3 || trimmed.length() > 50) {
            throw ErrorCode.INVALID_REQUEST.toException("Tên đăng nhập phải từ 3 đến 50 ký tự");
        }
        if (!trimmed.matches("^[a-zA-Z0-9_]+$")) {
            throw ErrorCode.INVALID_REQUEST.toException("Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới");
        }
    }

    /**
     * Validate email format
     */
    public void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw ErrorCode.INVALID_EMAIL.toException();
        }
        String trimmedEmail = email.trim();
        if (!EMAIL_PATTERN.matcher(trimmedEmail).matches()) {
            throw ErrorCode.INVALID_EMAIL_FORMAT.toException();
        }
    }

    /**
     * Validate password
     */
    public void validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Mật khẩu không được để trống");
        }
        if (password.length() < 8) {
            throw ErrorCode.INVALID_REQUEST.toException("Mật khẩu phải có ít nhất 8 ký tự");
        }
    }

    /**
     * Validate Role enum value
     */
    public void validateRole(String role) {
        if (role == null || role.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Vai trò không được để trống");
        }
        try {
            Role.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException(
                "Vai trò không hợp lệ. Các giá trị hợp lệ: ADMIN, HR, MANAGER, EMPLOYEE");
        }
    }
}

