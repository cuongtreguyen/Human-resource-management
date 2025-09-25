package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private String tokenType = "Bearer";
    private LocalDateTime expiresAt;
    private String username;
    private String role;

    // Constructors
    public LoginResponse() {}

    public LoginResponse(String token, LocalDateTime expiresAt, String username, String role) {
        this.token = token;
        this.expiresAt = expiresAt;
        this.username = username;
        this.role = role;
    }
    
}
