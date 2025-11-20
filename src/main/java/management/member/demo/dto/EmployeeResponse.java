package management.member.demo.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.Enum.EmployeeStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@Getter
@Setter
public class EmployeeResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String employeeCode;
    private String department;
    private String position;
    private LocalDate hireDate;
    private EmployeeStatus status;
    private BigDecimal baseSalary;
}
