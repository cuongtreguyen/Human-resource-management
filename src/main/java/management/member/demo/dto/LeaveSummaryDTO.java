package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho tổng hợp đơn nghỉ phép của một nhân viên
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveSummaryDTO {
    private Long total;
    private Long pending;
    private Long approved;
    private Long rejected;
}

