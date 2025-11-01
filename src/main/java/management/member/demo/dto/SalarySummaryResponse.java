package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * SalarySummaryResponse DTO - Tổng hợp thông tin lương của nhân viên
 * Bao gồm: Lương tháng gần nhất, Lương trung bình, Tổng thu nhập
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalarySummaryResponse {
    /** Lương tháng gần nhất (Latest Salary) */
    private BigDecimal latestSalary;
    
    /** Lương trung bình (Average Salary) */
    private BigDecimal averageSalary;
    
    /** Tổng thu nhập (Total Income) - Tổng tất cả netSalary đã thanh toán */
    private BigDecimal totalIncome;
}

