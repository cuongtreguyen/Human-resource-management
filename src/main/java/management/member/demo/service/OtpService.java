package management.member.demo.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class OtpService {

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();
    private final Random random = new Random();
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;

    private static class OtpData {
        String otp;
        long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1000000));
        long expiryTime = System.currentTimeMillis() + (OTP_EXPIRY_MINUTES * 60 * 1000);
        otpStore.put(email, new OtpData(otp, expiryTime));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData data = otpStore.get(email);
        if (data == null) {
            throw new RuntimeException("OTP_NOT_FOUND");
        }
        if (System.currentTimeMillis() > data.expiryTime) {
            otpStore.remove(email);
            throw new RuntimeException("OTP_EXPIRED");
        }
        if (!data.otp.equals(otp)) {
            throw new RuntimeException("INVALID_OTP");
        }
        return true;
    }

    public boolean hasValidOtp(String email) {
        OtpData data = otpStore.get(email);
        if (data == null) {
            return false;
        }
        if (System.currentTimeMillis() > data.expiryTime) {
            otpStore.remove(email);
            return false;
        }
        return true;
    }

    public long getOtpRemainingMinutes(String email) {
        OtpData data = otpStore.get(email);
        if (data == null) {
            return 0;
        }
        long remaining = data.expiryTime - System.currentTimeMillis();
        if (remaining <= 0) {
            otpStore.remove(email);
            return 0;
        }
        return remaining / (60 * 1000);
    }

    public void removeOtp(String email) {
        otpStore.remove(email);
    }

    public Map<String, Object> getOtpStatistics() {
        long validOtps = otpStore.values().stream()
                .filter(data -> System.currentTimeMillis() <= data.expiryTime)
                .count();

        return Map.of(
                "totalOtps", otpStore.size(),
                "validOtps", validOtps,
                "expiredOtps", otpStore.size() - validOtps
        );
    }
}

