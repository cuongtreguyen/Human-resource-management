package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO cho tổng lương theo phòng ban
 */
@Getter
@Setter
public class PayrollByDepartmentDTO {
    private String department;
    private BigDecimal totalPayrollEmployeeByDepartment;
}

