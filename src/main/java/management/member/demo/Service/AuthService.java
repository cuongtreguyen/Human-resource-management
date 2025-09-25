package management.member.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import management.member.demo.security.JwtService;

/**
 * Service xử lý authentication và authorization
 * Bao gồm đăng nhập, xác thực user và tạo JWT token
 */
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    /**
     * Xác thực user và tạo JWT token
     * @param username tên đăng nhập của user
     * @param password mật khẩu của user
     * @return JWT token nếu xác thực thành công
     * @throws AuthenticationException nếu thông tin đăng nhập không đúng
     */
    public String authenticate(String username, String password) {
        // Xác thực thông tin đăng nhập
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        // Lấy thông tin user từ authentication
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        // Tạo và trả về JWT token
        return jwtService.generateToken(userDetails);
    }
}
