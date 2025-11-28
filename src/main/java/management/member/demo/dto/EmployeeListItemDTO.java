package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class EmployeeListItemDTO {
    private String id;  // employeeId or employeeCode as string
    private String name;  // fullName
    private String email;
    private String position;
    private String department;
    private String phone;
    private String status;  // lowercase: active, inactive, on_leave, terminated
    private String avatar;  // placeholder URL
    private LocalDate hireDate;
    private BigDecimal salary;  // baseSalary
}

