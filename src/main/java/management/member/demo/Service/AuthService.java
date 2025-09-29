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
import management.member.demo.exception.BusinessException;
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

    private static final int MAX_FAILED_ATTEMPTS = 5;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService, UserDetailsService userDetailsService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Xác thực user và tạo JWT token
     * @param username tên đăng nhập của user
     * @param password mật khẩu của user
     * @return JWT token nếu xác thực thành công
     * @throws AuthenticationException nếu thông tin đăng nhập không đúng
     */
    public Tokens authenticate(String username, String password) {
        // Kiểm tra trạng thái tài khoản trước khi xác thực
        if (!isUserActiveAndNotLocked(username)) {
            throw new BusinessException("ACCOUNT_LOCKED_OR_INACTIVE", "Account is inactive or locked");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // Thành công: reset failed attempts và cập nhật last login
            recordSuccessfulLogin(username);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String accessToken = jwtService.generateToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);
            return new Tokens(accessToken, refreshToken);
        } catch (Exception ex) {
            // Thất bại: tăng failed attempts và có thể khóa tài khoản
            recordFailedLogin(username);
            if (ex instanceof BadCredentialsException || ex instanceof AuthenticationException) {
                throw new BusinessException("INVALID_CREDENTIALS", "Username or password is incorrect");
            }
            throw ex;
        }
    }

    /**
     * Đăng ký tài khoản mới
     */
    public User register(String username, String rawPassword, String email, String firstName, String lastName) {
        if (userRepository.existsByUsername(username)) {
            throw new BusinessException("USERNAME_EXISTS", "Username already exists");
        }
        if (email != null && !email.isBlank() && userRepository.existsByEmail(email)) {
            throw new BusinessException("EMAIL_EXISTS", "Email already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setIsActive(true);
        user.setIsLocked(false);
        user.setFailedLoginAttempts(0);
        user.setLastLogin(null);
        return userRepository.save(user);
    }

    /**
     * Cấp lại access token từ refresh token hợp lệ
     */
    public String refreshAccessToken(String refreshToken) {
        String username = jwtService.validateAndExtractUsernameFromRefreshToken(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
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

    /**
     * Lấy username hiện tại từ SecurityContext
     */
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

    /**
     * Lấy thông tin User hiện tại từ repository (có thể trả null nếu không tìm thấy)
     */
    public User getCurrentUser() {
        String username = getCurrentUsername();
        if (username == null) {
            return null;
        }
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElse(null);
    }

    private boolean isUserActiveAndNotLocked(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return true; // để AuthenticationManager xử lý không tồn tại
        }
        User user = userOpt.get();
        Boolean active = user.getIsActive();
        Boolean locked = user.getIsLocked();
        return (active == null || active) && (locked == null || !locked);
    }

    private void recordSuccessfulLogin(String username) {
        userRepository.findByUsername(username).ifPresent(u -> {
            u.setFailedLoginAttempts(0);
            u.setIsLocked(false);
            u.setLastLogin(LocalDateTime.now());
            userRepository.save(u);
        });
    }

    private void recordFailedLogin(String username) {
        userRepository.findByUsername(username).ifPresent(u -> {
            Integer attempts = u.getFailedLoginAttempts();
            int newAttempts = attempts == null ? 1 : attempts + 1;
            u.setFailedLoginAttempts(newAttempts);
            if (newAttempts >= MAX_FAILED_ATTEMPTS) {
                u.setIsLocked(true);
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
