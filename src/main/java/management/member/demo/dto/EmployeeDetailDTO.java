package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class EmployeeDetailDTO {
    private String id;  // employeeId or employeeCode
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String position;
    private String department;
    private String status;  // lowercase: active, inactive, on_leave, terminated
    private LocalDate hireDate;
    private BigDecimal salary;  // baseSalary
    private String personalEmail;
    private LocalDate dateOfBirth;
    private String gender;
    private String idNumber;
    private String taxCode;
    private String permanentAddress;
    private String temporaryAddress;
    private String employeeCode;
    private String contractCode;
    private String contractType;
}

