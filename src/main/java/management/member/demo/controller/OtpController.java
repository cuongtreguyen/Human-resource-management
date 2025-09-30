package management.member.demo.controller;

import management.member.demo.Service.OtpService;
import management.member.demo.Service.EmailService;
import management.member.demo.dto.ForgotPasswordRequest;
import management.member.demo.dto.VerifyOtpRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller xử lý các API liên quan đến OTP
 * Bao gồm tạo, xác thực và quản lý OTP
 */
@RestController
@RequestMapping("/otp")
@Tag(name = "OTP Management", description = "OTP generation and verification endpoints")
public class OtpController {

    private final OtpService otpService;
    private final EmailService emailService;

    @Autowired
    public OtpController(OtpService otpService, EmailService emailService) {
        this.otpService = otpService;
        this.emailService = emailService;
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate OTP", description = "Generate OTP for email verification")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OTP generated and sent successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to generate or send OTP")
    })
    public ResponseEntity<Map<String, String>> generateOtp(@RequestBody ForgotPasswordRequest request) {
        try {
            String otp = otpService.generateOtp(request.getEmail());
            
            // Gửi OTP qua email
            String fullName = "User"; // Có thể lấy từ database nếu cần
            emailService.sendForgotPasswordOtp(request.getEmail(), fullName, otp);
            
            return ResponseEntity.ok(Map.of(
                "message", "OTP generated and sent to your email",
                "email", request.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to generate OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify OTP", description = "Verify OTP for email")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OTP verified successfully"),
            @ApiResponse(responseCode = "400", description = "OTP_NOT_FOUND/OTP_EXPIRED/INVALID_OTP")
    })
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
            long remainingMinutes = otpService.getOtpRemainingMinutes(request.getEmail());
            
            return ResponseEntity.ok(Map.of(
                "valid", isValid,
                "remainingMinutes", remainingMinutes,
                "message", "OTP verified successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/status/{email}")
    @Operation(summary = "Check OTP status", description = "Check if OTP exists and remaining time")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OTP status retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getOtpStatus(@PathVariable String email) {
        boolean hasValidOtp = otpService.hasValidOtp(email);
        long remainingMinutes = otpService.getOtpRemainingMinutes(email);
        
        return ResponseEntity.ok(Map.of(
            "hasValidOtp", hasValidOtp,
            "remainingMinutes", remainingMinutes,
            "email", email
        ));
    }

    @DeleteMapping("/remove/{email}")
    @Operation(summary = "Remove OTP", description = "Remove OTP for specific email")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OTP removed successfully")
    })
    public ResponseEntity<Map<String, String>> removeOtp(@PathVariable String email) {
        otpService.removeOtp(email);
        return ResponseEntity.ok(Map.of("message", "OTP removed successfully", "email", email));
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get OTP statistics", description = "Get OTP system statistics for monitoring")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = otpService.getOtpStatistics();
        return ResponseEntity.ok(stats);
    }
}
