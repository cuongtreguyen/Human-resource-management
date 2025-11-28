package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class LoginResponse {
    // Token field (renamed from accessToken to match API spec)
    private String token;
    
    // User information object
    private UserInfoDTO user;
    
    // Keep these for backward compatibility (optional)
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private LocalDateTime accessTokenExpiresAt;
    private String username;
    private String role;
}
