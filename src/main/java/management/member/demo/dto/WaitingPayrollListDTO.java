package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.PayrollStatus;

import java.math.BigDecimal;

/**
 * DTO cho danh sách payroll đang chờ thanh toán
 */
@Getter
@Setter
public class WaitingPayrollListDTO {
    private String employeeId;
    private String firstName;
    private String department;
    private BigDecimal netSalary;
    private PayrollStatus status;
}

