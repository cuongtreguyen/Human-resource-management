package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.PayrollStatus;

import java.math.BigDecimal;

/**
 * DTO cho bảng lương hàng tháng của nhân viên dành cho Accountant
 */
@Getter
@Setter
public class MonthlyPayrollForAccountantDTO {
    private String fullName;
    private String email;
    private String department;
    private BigDecimal otHours;
    private BigDecimal otPay;
    private BigDecimal baseSalary;
    private BigDecimal netSalary;
    private PayrollStatus status;
}

