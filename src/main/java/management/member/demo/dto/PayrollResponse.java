package management.member.demo.dto;

import lombok.*;
import management.member.demo.enums.PayrollStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * PayrollResponse DTO - Response cho Payroll
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollResponse {
    private Long id;
    private String code;
    private LocalDate period;
    private LocalDate createdDate;
    private LocalDate paymentDate;
    private BigDecimal totalAmount;
    private PayrollStatus status;
    private String note;

    // Danh sách salary rút gọn (tùy chọn) - Service có thể set nếu cần
    private List<PayrollEmployeeSummary> employees;
}
