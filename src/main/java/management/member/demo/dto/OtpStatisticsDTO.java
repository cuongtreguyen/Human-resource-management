package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho thống kê OTP
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpStatisticsDTO {
    private Long totalOtps;
    private Long validOtps;
    private Long expiredOtps;
}

