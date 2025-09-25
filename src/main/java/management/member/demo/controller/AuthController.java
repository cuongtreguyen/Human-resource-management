package management.member.demo.controller;

import management.member.demo.Service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * API đăng nhập user và trả về JWT token
     * @param loginRequest thông tin đăng nhập (username, password)
     * @return JWT token nếu đăng nhập thành công
     */
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // Xác thực user và tạo token
        String token = authService.authenticate(username, password);

        // Trả về token trong response
        return ResponseEntity.ok(Map.of("token", token));
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
}
