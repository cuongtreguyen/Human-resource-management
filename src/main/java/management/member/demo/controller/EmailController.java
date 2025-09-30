package management.member.demo.controller;

import management.member.demo.Service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/email")
@Tag(name = "Email", description = "Email sending endpoints")
public class EmailController {

    private final EmailService emailService;

    @Autowired
    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    @Operation(summary = "Send welcome email with credentials", description = "Send welcome email with login credentials to new employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Welcome email with credentials sent successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to send email")
    })
    public ResponseEntity<Map<String, String>> sendWelcomeWithCredentials(
            @RequestParam String toEmail,
            @RequestParam String fullName,
            @RequestParam String username,
            @RequestParam String password) {
        try {
            // Tạo employeeId tự động
            String employeeId = "EMP" + System.currentTimeMillis() % 1000;

            emailService.sendEmployeeCredentials(toEmail, fullName, username, password, employeeId);
            return ResponseEntity.ok(Map.of("status", "Welcome email with credentials sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to send email: " + e.getMessage()));
        }
    }
}
