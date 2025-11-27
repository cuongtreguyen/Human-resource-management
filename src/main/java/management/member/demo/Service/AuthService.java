package management.member.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import management.member.demo.security.JwtService;
import management.member.demo.repository.UserRepository;
import management.member.demo.entity.User;
import management.member.demo.Enum.Role;
import management.member.demo.exception.base.BusinessException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.BadCredentialsException;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Service xử lý authentication và authorization
 * Bao gồm đăng nhập, xác thực user và tạo JWT token
 */
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    private static final int MAX_FAILED_ATTEMPTS = 5;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService, UserDetailsService userDetailsService, UserRepository userRepository, PasswordEncoder passwordEncoder, OtpService otpService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
    }

    // Xác thực user bằng email và password, tạo JWT token
    public Tokens authenticate(String email, String password) {
        // Kiểm tra trạng thái tài khoản trước khi xác thực
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Nếu tài khoản bị khóa (chỉ kiểm tra isLocked, không phụ thuộc vào lockedAt)
            if (user.getIsLocked() != null && user.getIsLocked()) {
                // lockedAt chỉ để hiển thị thời gian bị khóa, không ảnh hưởng đến việc chặn
                if (user.getLockedAt() != null) {
                    // Tính thời gian đã bị khóa (phút) - chỉ để hiển thị
                    long lockedMinutes = getLockedDuration(user);
                    throw new BusinessException("ACCOUNT_LOCKED_OR_INACTIVE", 
                        String.format("Account is locked since %d minute(s) ago. Please contact administrator.", lockedMinutes));
                } else {
                    // Không có lockedAt - không hiển thị thời gian
                    throw new BusinessException("ACCOUNT_LOCKED_OR_INACTIVE", "Account is locked. Please contact administrator.");
                }
            }
        }
        
        if (!isUserActiveAndNotLocked(email)) {
            throw new BusinessException("ACCOUNT_LOCKED_OR_INACTIVE", "Account is inactive or locked");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            // Thành công: reset failed attempts và cập nhật last login
            recordSuccessfulLogin(email);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            try {
                String accessToken = jwtService.generateToken(userDetails);
                String refreshToken = jwtService.generateRefreshToken(userDetails);
                return new Tokens(accessToken, refreshToken);
            } catch (Exception tokenEx) {
                // Log lỗi khi tạo token
                System.err.println("Error generating token: " + tokenEx.getMessage());
                tokenEx.printStackTrace();
                throw new BusinessException("TOKEN_GENERATION_ERROR", "Failed to generate token: " + tokenEx.getMessage());
            }
        } catch (Exception ex) {
            // Thất bại: tăng failed attempts và có thể khóa tài khoản
            recordFailedLogin(email);
            if (ex instanceof BadCredentialsException || ex instanceof AuthenticationException) {
                throw new BusinessException("INVALID_CREDENTIALS", "Email or password is incorrect");
            }
            throw ex;
        }
    }


    /**
     * Cấp lại access token từ refresh token hợp lệ
     */
    public String refreshAccessToken(String refreshToken) {
        // Token chứa email (được dùng làm username trong UserDetails)
        String email = jwtService.validateAndExtractUsernameFromRefreshToken(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        return jwtService.generateToken(userDetails);
    }

    /**
     * Thu hồi một token (access hoặc refresh)
     */
    public void logout(String token) {
        jwtService.revokeToken(token);
    }

    /**
     * Kiểm tra access token hợp lệ
     */
    public boolean validateToken(String token) {
        try {
            String username = jwtService.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            return jwtService.isTokenValid(token, userDetails);
        } catch (Exception e) {
            return false;
        }
    }

    // Lấy email hiện tại từ SecurityContext (email được dùng làm username trong UserDetails)
    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return String.valueOf(principal);
    }

    // Lấy thông tin User hiện tại từ repository (có thể trả null nếu không tìm thấy)
    public User getCurrentUser() {
        String email = getCurrentUsername();
        if (email == null) {
            return null;
        }
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }

    // Lấy role của user hiện tại
    public String getCurrentUserRole() {
        User user = getCurrentUser();
        if (user == null || user.getRole() == null) {
            return Role.EMPLOYEE.name();
        }
        return user.getRole().name();
    }

    // Lấy user bằng email
    public User getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }

    /**
     * Gửi OTP cho quên mật khẩu
     */
    public String sendForgotPasswordOtp(String email) {
        // Kiểm tra email có tồn tại không
        if (!userRepository.existsByEmail(email)) {
            throw new BusinessException("EMAIL_NOT_FOUND", "Email not found in system");
        }

        // Tạo OTP sử dụng OtpService
        return otpService.generateOtp(email);
    }

    /**
     * Xác thực OTP
     */
    public boolean verifyOtp(String email, String otp) {
        return otpService.verifyOtp(email, otp);
    }

    /**
     * Đặt lại mật khẩu với OTP
     */
    public void resetPassword(String email, String otp, String newPassword) {
        // Xác thực OTP trước
        otpService.verifyOtp(email, otp);
        
        // Tìm user và cập nhật mật khẩu
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new BusinessException("USER_NOT_FOUND", "User not found");
        }
        
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setFailedLoginAttempts(0);
        user.setIsLocked(false);
        userRepository.save(user);
        
        // Xóa OTP sau khi đặt lại mật khẩu thành công
        otpService.removeOtp(email);
    }

    // Test method để reset password trực tiếp (không cần OTP) - chỉ dùng cho development
    public void testResetPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new BusinessException("USER_NOT_FOUND", "User not found");
        }
        
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setFailedLoginAttempts(0);
        user.setIsLocked(false);
        user.setLockedAt(null);
        userRepository.save(user);
    }

    // Tính thời gian đã bị khóa (phút) - chỉ để hiển thị
    private long getLockedDuration(User user) {
        if (user.getLockedAt() == null) {
            return 0;
        }
        LocalDateTime now = LocalDateTime.now();
        return java.time.Duration.between(user.getLockedAt(), now).toMinutes();
    }

    private boolean isUserActiveAndNotLocked(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return true; // để AuthenticationManager xử lý không tồn tại
        }
        User user = userOpt.get();
        Boolean active = user.getIsActive();
        Boolean locked = user.getIsLocked();
        // Chặn nếu isLocked = true (không phân biệt khóa tự động hay thủ công)
        return (active == null || active) && (locked == null || !locked);
    }

    private void recordSuccessfulLogin(String email) {
        userRepository.findByEmail(email).ifPresent(u -> {
            u.setFailedLoginAttempts(0);
            u.setIsLocked(false);
            u.setLockedAt(null); // Reset thời gian khóa
            u.setLastLogin(LocalDateTime.now());
            userRepository.save(u);
        });
    }

    private void recordFailedLogin(String email) {
        userRepository.findByEmail(email).ifPresent(u -> {
            Integer attempts = u.getFailedLoginAttempts();
            int newAttempts = attempts == null ? 1 : attempts + 1;
            u.setFailedLoginAttempts(newAttempts);
            if (newAttempts >= MAX_FAILED_ATTEMPTS) {
                u.setIsLocked(true);
                u.setLockedAt(LocalDateTime.now()); // Lưu thời gian bị khóa
            }
            userRepository.save(u);
        });
    }

    /**
     * Value object chứa cặp token
     */
    public static class Tokens {
        private final String accessToken;
        private final String refreshToken;

        public Tokens(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public String getRefreshToken() {
            return refreshToken;
        }
    }
}
