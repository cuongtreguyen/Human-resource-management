package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import management.member.demo.Enum.PayrollStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * PayrollRequest DTO - Dùng cho tạo và cập nhật Payroll
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollRequest {

    @NotBlank(message = "Mã kỳ lương không được để trống")
    private String code;

    @NotNull(message = "Kỳ lương không được để trống")
    private LocalDate period;

    private LocalDate createdDate;

    private BigDecimal totalAmount;

    @NotNull(message = "Trạng thái bảng lương không được để trống")
    private PayrollStatus status;

    private String note;
}
