package management.member.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SupportStatsDTO {
    long totalRequests;     // Tổng yêu cầu
    long escalatedToAdmin;  // Cần chuyển Admin / Admin đang xử lý
    long waitingInfo;       // Cần thông tin NV
    long completed;         // Đã hoàn thành
}