package management.member.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.Enum.SalaryStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * SalaryRequest DTO - Dùng cho tạo và cập nhật Salary
 * netSalary được tính tự động, không cần truyền vào
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryRequest {
    
    @NotNull(message = "ID nhân viên không được để trống")
    private Long employeeId;

    @NotNull(message = "Lương cơ bản không được để trống")
    private BigDecimal baseSalary;

    private BigDecimal allowance;
    
    private BigDecimal overtimePay;
    
    private BigDecimal bonus;
    
    private BigDecimal deduction;

    @NotNull(message = "Trạng thái lương không được để trống")
    private SalaryStatus status;

    @NotNull(message = "Ngày thanh toán không được để trống")
    private LocalDate paymentDate;
}

