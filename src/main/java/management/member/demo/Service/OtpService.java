package management.member.demo.Service;

import management.member.demo.exception.base.BusinessException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service xử lý OTP (One-Time Password) cho các chức năng xác thực
 * Bao gồm tạo, lưu trữ, xác thực và quản lý OTP
 */
@Service
public class OtpService {

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_OTP_ATTEMPTS_PER_HOUR = 3;
    private static final int RATE_LIMIT_WINDOW_MINUTES = 60;
    
    // In-memory storage for OTPs (in production, use Redis or database)
    private final ConcurrentHashMap<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    
    // Rate limiting storage: email -> (attempts, first attempt time)
    private final ConcurrentHashMap<String, RateLimitData> rateLimitStorage = new ConcurrentHashMap<>();

    /**
     * Tạo và lưu OTP cho email
     * @param email email cần tạo OTP
     * @return OTP được tạo
     */
    public String generateOtp(String email) {
        // Kiểm tra rate limiting
        if (!canGenerateOtp(email)) {
            throw new BusinessException("RATE_LIMIT_EXCEEDED", 
                "Quá nhiều yêu cầu OTP. Vui lòng thử lại sau " + RATE_LIMIT_WINDOW_MINUTES + " phút");
        }
        
        String otp = generateRandomOtp();
        OtpData otpData = new OtpData(otp, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        otpStorage.put(email, otpData);
        
        // Cập nhật rate limiting
        updateRateLimit(email);
        
        return otp;
    }

    /**
     * Xác thực OTP
     * @param email email đã gửi OTP
     * @param otp mã OTP cần xác thực
     * @return true nếu OTP hợp lệ
     * @throws BusinessException nếu OTP không tồn tại, hết hạn hoặc không đúng
     */
    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            throw new BusinessException("OTP_NOT_FOUND", "OTP not found or expired");
        }
        
        if (otpData.isExpired()) {
            otpStorage.remove(email);
            throw new BusinessException("OTP_EXPIRED", "OTP has expired");
        }
        
        if (!otpData.getOtp().equals(otp)) {
            throw new BusinessException("INVALID_OTP", "Invalid OTP");
        }
        
        return true;
    }

    /**
     * Xóa OTP sau khi sử dụng thành công
     * @param email email cần xóa OTP
     */
    public void removeOtp(String email) {
        otpStorage.remove(email);
    }

    /**
     * Kiểm tra OTP có tồn tại và chưa hết hạn không
     * @param email email cần kiểm tra
     * @return true nếu OTP tồn tại và chưa hết hạn
     */
    public boolean hasValidOtp(String email) {
        OtpData otpData = otpStorage.get(email);
        return otpData != null && !otpData.isExpired();
    }

    /**
     * Lấy thời gian còn lại của OTP (phút)
     * @param email email cần kiểm tra
     * @return số phút còn lại, -1 nếu không tồn tại
     */
    public long getOtpRemainingMinutes(String email) {
        OtpData otpData = otpStorage.get(email);
        if (otpData == null || otpData.isExpired()) {
            return -1;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiry = otpData.getExpiryTime();
        long minutes = java.time.Duration.between(now, expiry).toMinutes();
        return Math.max(0, minutes);
    }

    /**
     * Tạo OTP ngẫu nhiên
     * @return OTP 6 chữ số
     */
    private String generateRandomOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Kiểm tra có thể tạo OTP không (rate limiting)
     */
    private boolean canGenerateOtp(String email) {
        RateLimitData rateData = rateLimitStorage.get(email);
        if (rateData == null) {
            return true;
        }
        
        // Kiểm tra thời gian window
        if (rateData.isExpired()) {
            rateLimitStorage.remove(email);
            return true;
        }
        
        // Kiểm tra số lần thử
        return rateData.getAttempts() < MAX_OTP_ATTEMPTS_PER_HOUR;
    }

    /**
     * Cập nhật rate limiting
     */
    private void updateRateLimit(String email) {
        RateLimitData rateData = rateLimitStorage.get(email);
        if (rateData == null) {
            rateData = new RateLimitData();
        }
        
        if (rateData.isExpired()) {
            rateData = new RateLimitData();
        }
        
        rateData.incrementAttempts();
        rateLimitStorage.put(email, rateData);
    }

    /**
     * Tự động dọn dẹp OTP hết hạn - chạy mỗi 5 phút
     */
    @Scheduled(fixedRate = 300000) // 5 phút = 300,000ms
    public void cleanupExpiredOtps() {
        int removedCount = 0;
        
        // Dọn dẹp OTP hết hạn
        otpStorage.entrySet().removeIf(entry -> {
            boolean expired = entry.getValue().isExpired();
            if (expired) {
                System.out.println("Đã xóa OTP hết hạn cho email: " + entry.getKey());
            }
            return expired;
        });
        
        // Dọn dẹp rate limiting hết hạn
        rateLimitStorage.entrySet().removeIf(entry -> {
            boolean expired = entry.getValue().isExpired();
            if (expired) {
                System.out.println("Đã xóa rate limit hết hạn cho email: " + entry.getKey());
            }
            return expired;
        });
        
        System.out.println("Đã dọn dẹp " + removedCount + " OTP hết hạn");
    }

    /**
     * Lấy thống kê OTP
     */
    public Map<String, Object> getOtpStatistics() {
        int totalOtps = otpStorage.size();
        int activeRateLimits = rateLimitStorage.size();
        
        return Map.of(
            "totalActiveOtps", totalOtps,
            "activeRateLimits", activeRateLimits,
            "maxAttemptsPerHour", MAX_OTP_ATTEMPTS_PER_HOUR,
            "otpExpiryMinutes", OTP_EXPIRY_MINUTES
        );
    }

    /**
     * Class lưu trữ thông tin OTP
     */
    private static class OtpData {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }
    }

    /**
     * Class lưu trữ thông tin rate limiting
     */
    private static class RateLimitData {
        private final AtomicInteger attempts;
        private final LocalDateTime firstAttemptTime;

        public RateLimitData() {
            this.attempts = new AtomicInteger(0);
            this.firstAttemptTime = LocalDateTime.now();
        }

        public int getAttempts() {
            return attempts.get();
        }

        public void incrementAttempts() {
            attempts.incrementAndGet();
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(firstAttemptTime.plusMinutes(RATE_LIMIT_WINDOW_MINUTES));
        }
    }
}
