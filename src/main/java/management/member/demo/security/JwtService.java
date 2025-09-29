package management.member.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import management.member.demo.exception.BusinessException;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service xử lý JWT (JSON Web Token) cho authentication và authorization
 * Bao gồm tạo token, xác thực token và trích xuất thông tin từ token
 */
@Service
public class JwtService {
    private static final String SECRET_KEY = "your-256-bit-secret"; // TODO: lấy từ AWS Secrets Manager
    
    private final JwtConfig jwtConfig;
    private final CacheManager cacheManager;
    
    @Autowired
    public JwtService(JwtConfig jwtConfig, CacheManager cacheManager) {
        this.jwtConfig = jwtConfig;
        this.cacheManager = cacheManager;
    }

    /**
     * Trích xuất username từ JWT token
     * @param token JWT token cần xử lý
     * @return username được lưu trong token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Trích xuất thời gian hết hạn từ JWT token
     * @param token JWT token cần xử lý
     * @return thời gian hết hạn của token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Trích xuất thông tin tùy chỉnh từ JWT token
     * @param token JWT token cần xử lý
     * @param claimsResolver function để trích xuất thông tin cụ thể
     * @return thông tin được trích xuất
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Trích xuất tất cả claims từ JWT token
     * @param token JWT token cần xử lý
     * @return tất cả claims trong token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Kiểm tra xem JWT token đã hết hạn chưa
     * @param token JWT token cần kiểm tra
     * @return true nếu token đã hết hạn, false nếu còn hiệu lực
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Kiểm tra tính hợp lệ của JWT token với thông tin user
     * @param token JWT token cần kiểm tra
     * @param userDetails thông tin user để so sánh
     * @return true nếu token hợp lệ, false nếu không hợp lệ
     */
    public Boolean isTokenValid(String token, UserDetails userDetails) {
        if (isTokenRevoked(token)) {
            return false;
        }
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Tạo JWT token mới cho user
     * @param userDetails thông tin user để tạo token
     * @return JWT token được tạo
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "access");
        return createToken(claims, userDetails.getUsername(), jwtConfig.getAccessTokenTtl());
    }

    /**
     * Tạo Refresh Token mới cho user
     */
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return createToken(claims, userDetails.getUsername(), jwtConfig.getRefreshTokenTtl());
    }

    /**
     * Kiểm tra token có phải refresh token không
     */
    public boolean isRefreshToken(String token) {
        return "refresh".equalsIgnoreCase(extractClaim(token, c -> (String) c.get("type")));
    }

    /**
     * Kiểm tra token có phải access token không
     */
    public boolean isAccessToken(String token) {
        return "access".equalsIgnoreCase(extractClaim(token, c -> (String) c.get("type")));
    }

    /**
     * Thu hồi (revoke) một token bằng cách đưa vào blacklist trong cache
     */
    public void revokeToken(String token) {
        Cache cache = cacheManager.getCache("tokens");
        if (cache != null) {
            cache.put("revoked:" + token, Boolean.TRUE);
        }
    }

    /**
     * Kiểm tra token đã bị revoke chưa
     */
    public boolean isTokenRevoked(String token) {
        Cache cache = cacheManager.getCache("tokens");
        if (cache == null) {
            return false;
        }
        Boolean revoked = cache.get("revoked:" + token, Boolean.class);
        return Boolean.TRUE.equals(revoked);
    }

    /**
     * Validate refresh token và trả về username nếu hợp lệ
     */
    public String validateAndExtractUsernameFromRefreshToken(String refreshToken) {
        if (!isRefreshToken(refreshToken)) {
            throw new BusinessException("INVALID_TOKEN_TYPE", "Invalid token type");
        }
        if (isTokenRevoked(refreshToken)) {
            throw new BusinessException("TOKEN_REVOKED", "Token has been revoked");
        }
        if (isTokenExpired(refreshToken)) {
            throw new BusinessException("TOKEN_EXPIRED", "Token has expired");
        }
        return extractUsername(refreshToken);
    }

    /**
     * Tạo JWT token với claims và subject cụ thể
     * @param claims thông tin bổ sung lưu trong token
     * @param subject chủ thể của token (thường là username)
     * @return JWT token được tạo
     */
    private String createToken(Map<String, Object> claims, String subject, long ttlSeconds) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuer(jwtConfig.getIssuer())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ttlSeconds * 1000))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
}
