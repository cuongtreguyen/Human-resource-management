package management.member.demo.controller;

import management.member.demo.Service.AuthService;
import management.member.demo.Service.EmailService;
import management.member.demo.dto.LoginRequest;
import management.member.demo.dto.LoginResponse;
import management.member.demo.dto.ForgotPasswordRequest;
import management.member.demo.dto.ResetPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.time.LocalDateTime;

import management.member.demo.dto.TokenRequest;

/**
 * Controller xử lý các API liên quan đến authentication
 * Bao gồm đăng nhập, kiểm tra sức khỏe service
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

    @Autowired
    public AuthController(AuthService authService, EmailService emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }

    /**
     * API đăng nhập user và trả về JWT token
     * @param loginRequest thông tin đăng nhập (username, password)
     * @return JWT token nếu đăng nhập thành công
     */
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return access & refresh tokens")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login success"),
            @ApiResponse(responseCode = "401", description = "INVALID_CREDENTIALS"),
            @ApiResponse(responseCode = "403", description = "ACCOUNT_LOCKED_OR_INACTIVE")
    })
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthService.Tokens tokens = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        LoginResponse response = new LoginResponse();
        response.setUsername(loginRequest.getUsername());
        response.setAccessToken(tokens.getAccessToken());
        response.setRefreshToken(tokens.getRefreshToken());
        response.setAccessTokenExpiresAt(LocalDateTime.now().plusSeconds(3600));
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
    public ResponseEntity<Map<String, String>> logout(@RequestBody TokenRequest body) {
        String token = body.getToken();
        authService.logout(token);
        return ResponseEntity.ok(Map.of("status", "revoked"));
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
    @Operation(summary = "Forgot password", description = "Send OTP to email for password reset")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
            @ApiResponse(responseCode = "400", description = "EMAIL_NOT_FOUND")
    })
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String otp = authService.sendForgotPasswordOtp(request.getEmail());
        
        // Lấy tên đầy đủ từ database để gửi email
        String fullName = "User"; // Có thể lấy từ database nếu cần
        emailService.sendForgotPasswordOtp(request.getEmail(), fullName, otp);
        
        return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
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
}
