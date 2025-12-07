package management.member.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO cho request tính toán Payroll của Accountant
 * Tất cả các field đều tự nhập
 */
@Getter
@Setter
public class PayrollCalculationForAccountantRequestDTO {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;
    
    /** Họ và tên (tự nhập) */
    private String fullName;
    
    /** Lương cơ bản (tự nhập) */
    @NotNull(message = "Base salary is required")
    private BigDecimal baseSalary;
    
    /** Số giờ OT (tự nhập) */
    private BigDecimal otHours;
    
    /** Số ngày nghỉ (tự nhập) */
    private String dayOff;
    
    /** Số ngày đi muộn (tự nhập) */
    private String lateDay;
    
    /** Phụ cấp (tự nhập) */
    private BigDecimal allowance;
    
    /** Khấu trừ chung (tự nhập) */
    private BigDecimal generalDeductions;
    
    /** Thưởng (tự nhập) */
    private BigDecimal bonus;
    
    /** Payroll ID (optional) - Nếu có, sẽ gán Salary vào Payroll này */
    private Long payrollId;
}

