package management.member.demo.service;

import management.member.demo.dto.LoginRequest;
import management.member.demo.dto.LoginResponse;
import management.member.demo.dto.TokenRequest;
import management.member.demo.entity.User;
import management.member.demo.exception.base.BusinessException;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.UserRepository;
import management.member.demo.security.JwtService;
import management.member.demo.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    public static class Tokens {
        private String accessToken;
        private String refreshToken;
        private String role;
        
        public String getAccessToken() {
            return accessToken;
        }
        
        public String getRefreshToken() {
            return refreshToken;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }
        
        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public Tokens authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.INVALID_CREDENTIALS.getCode(),
                        ErrorCode.INVALID_CREDENTIALS.getMessage()));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException(
                    ErrorCode.INVALID_CREDENTIALS.getCode(),
                    ErrorCode.INVALID_CREDENTIALS.getMessage());
        }

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new BusinessException(
                    ErrorCode.ACCOUNT_LOCKED_OR_INACTIVE.getCode(),
                    "Tài khoản không hoạt động");
        }

        if (Boolean.TRUE.equals(user.getIsLocked())) {
            throw new BusinessException(
                    ErrorCode.ACCOUNT_LOCKED_OR_INACTIVE.getCode(),
                    "Tài khoản đã bị khóa");
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Convert User to UserDetails for JWT generation
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        
        Tokens tokens = new Tokens();
        tokens.accessToken = jwtService.generateToken(userDetails);
        tokens.refreshToken = jwtService.generateRefreshToken(userDetails);
        tokens.role = user.getRole() != null ? user.getRole().name() : "EMPLOYEE";

        return tokens;
    }

    public LoginResponse login(LoginRequest request) {
        Tokens tokens = authenticate(request.getEmail(), request.getPassword());
        
        LoginResponse response = new LoginResponse();
        response.setToken(tokens.accessToken);
        response.setAccessToken(tokens.accessToken);
        response.setRefreshToken(tokens.refreshToken);
        response.setRole(tokens.role);

        return response;
    }

    public Map<String, String> refreshToken(TokenRequest request) {
        // Validate refresh token and generate new access token
        String username = jwtService.validateAndExtractUsernameFromRefreshToken(request.getToken());
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String newAccessToken = jwtService.generateToken(userDetails);
        return Map.of("accessToken", newAccessToken);
    }
    
    public String refreshAccessToken(String refreshToken) {
        String username = jwtService.validateAndExtractUsernameFromRefreshToken(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwtService.generateToken(userDetails);
    }
    
    public void logout(String token) {
        // TODO: Implement token blacklist or revocation
        // For now, just a placeholder
    }
    
    public void changePassword(String oldPassword, String newPassword) {
        // Get current user from security context
        // For now, throw exception - needs security context implementation
        throw new RuntimeException("Not implemented - needs security context");
    }
    
    public boolean validateToken(String token) {
        try {
            String username = jwtService.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            return jwtService.isTokenValid(token, userDetails);
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getCurrentUsername() {
        // TODO: Get from SecurityContextHolder
        return null;
    }
    
    public String sendForgotPasswordOtp(String email) {
        // TODO: Generate and save OTP
        return "123456"; // Mock OTP
    }
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));
    }

    
    public void resetPassword(String email, String otp, String newPassword) {
        // TODO: Validate OTP and reset password
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public void testResetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}

