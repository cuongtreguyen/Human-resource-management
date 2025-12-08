package management.member.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeLeaveSummaryDTO {
    private long remaining;  // Phép năm còn lại
    private long used;       // Đã sử dụng
    private long pending;    // Đơn đang chờ duyệt
}
