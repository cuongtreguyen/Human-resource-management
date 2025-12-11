package management.member.demo.controller;

import management.member.demo.dto.LoginRequest;
import management.member.demo.dto.LoginResponse;
import management.member.demo.dto.ForgotPasswordRequest;
import management.member.demo.dto.ResetPasswordRequest;
import management.member.demo.dto.TokenRequest;
import management.member.demo.entity.User;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.mapper.AuthMapper;
import management.member.demo.service.AuthService;
import management.member.demo.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller xử lý các API liên quan đến authentication
 * Bao gồm đăng nhập, kiểm tra sức khỏe service
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;
    private final AuthMapper authMapper;

    @Autowired
    public AuthController(AuthService authService, EmailService emailService, AuthMapper authMapper) {
        this.authService = authService;
        this.emailService = emailService;
        this.authMapper = authMapper;
    }

    // Đăng nhập bằng email và password, trả về JWT token cùng với role
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user with email and password, return access & refresh tokens")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login success"),
            @ApiResponse(responseCode = "401", description = "INVALID_CREDENTIALS"),
            @ApiResponse(responseCode = "403", description = "ACCOUNT_LOCKED_OR_INACTIVE")
    })
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthService.Tokens tokens = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        LoginResponse response = new LoginResponse();

        // Lấy thông tin user
        User currentUser = authService.getUserByEmail(loginRequest.getEmail());

        // Map response sử dụng AuthMapper
        authMapper.populateLoginResponse(response, currentUser, loginRequest.getEmail(), 
                                        tokens.getAccessToken(), tokens.getRefreshToken());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Issue new access token from refresh token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Refresh success"),
            @ApiResponse(responseCode = "401", description = "TOKEN_EXPIRED/TOKEN_REVOKED/INVALID_TOKEN_TYPE")
    })
    public ResponseEntity<Map<String, String>> refresh(@RequestBody TokenRequest body) {
        String refreshToken = body.getToken();
        String newAccessToken = authService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Revoke a token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token revoked")
    })
    public ResponseEntity<Map<String, Object>> logout(@RequestBody TokenRequest body) {
        String token = body.getToken();
        authService.logout(token);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully", "success", true));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Change user password")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid old password")
    })
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            throw ErrorCode.INVALID_REQUEST.toException("oldPassword and newPassword are required");
        }

        if (newPassword.length() < 8) {
            throw ErrorCode.INVALID_PASSWORD_FORMAT.toException();
        }

        authService.changePassword(oldPassword, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully", "success", true));
    }

    /**
     * API kiểm tra chất lượng của authentication service
     * @return thông tin trạng thái service
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if authentication service is running")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "auth"));
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate token", description = "Validate an access token")
    public ResponseEntity<Map<String, Object>> validate(@RequestBody TokenRequest body) {
        boolean valid = authService.validateToken(body.getToken());
        return ResponseEntity.ok(Map.of("valid", valid));
    }

    @GetMapping("/me")
    @Operation(summary = "Current user", description = "Get username from current security context")
    public ResponseEntity<Map<String, String>> me() {
        String username = authService.getCurrentUsername();
        return ResponseEntity.ok(Map.of("username", username == null ? "anonymous" : username));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Send OTP to personal email for password reset")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
            @ApiResponse(responseCode = "400", description = "USER_NOT_FOUND")
    })
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String otp = authService.sendForgotPasswordOtp(request.getEmail());

        // Lấy thông tin user và employee từ email công ty
        User user = authService.getUserByEmail(request.getEmail());
        String fullName = (user != null && user.getEmployee() != null && user.getEmployee().getFullName() != null) 
                ? user.getEmployee().getFullName() 
                : "User";
        
        // Lấy personal email từ Employee để gửi OTP
        String personalEmail = null;
        if (user != null && user.getEmployee() != null) {
            personalEmail = user.getEmployee().getPersonalEmail();
        }
        
        // Nếu không có personal email, fallback về email công ty
        String emailToSend = (personalEmail != null && !personalEmail.trim().isEmpty()) 
                ? personalEmail 
                : request.getEmail();
        
        emailService.sendForgotPasswordOtp(emailToSend, fullName, otp);

        return ResponseEntity.ok(Map.of("message", "OTP sent to your personal email"));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password using OTP")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @ApiResponse(responseCode = "400", description = "OTP_NOT_FOUND/OTP_EXPIRED/INVALID_OTP/USER_NOT_FOUND")
    })
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    // Endpoint test để reset password trực tiếp (không cần OTP) - chỉ dùng cho development
    @PostMapping("/test/reset-password")
    @Operation(summary = "Test reset password", description = "Reset password directly without OTP (for testing only)")
    public ResponseEntity<Map<String, String>> testResetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        if (email == null || newPassword == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Email and newPassword are required");
        }
        authService.testResetPassword(email, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
}
