package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddEmployeeRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    private String name; // firstName + lastName

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 120, message = "Email must not exceed 120 characters")
    private String email; // companyEmail

    @NotBlank(message = "Position is required")
    @Size(max = 100, message = "Position must not exceed 100 characters")
    private String position;

    @NotBlank(message = "Department is required")
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;

    @Size(max = 30, message = "Phone must not exceed 30 characters")
    private String phone;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "active|inactive|on_leave|terminated", 
             message = "Status must be one of: active, inactive, on_leave, terminated")
    private String status;

    @NotNull(message = "Hire date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate hireDate;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "0.0", message = "Salary must be greater than or equal to 0")
    private BigDecimal salary; // VND

    @Email(message = "Personal email must be valid")
    @Size(max = 120, message = "Personal email must not exceed 120 characters")
    private String personalEmail;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @Pattern(regexp = "male|female", message = "Gender must be male or female")
    private String gender;

    @Size(max = 20, message = "ID number must not exceed 20 characters")
    private String idNumber; // CMND/CCCD

    @Size(max = 20, message = "Tax code must not exceed 20 characters")
    private String taxCode;

    @Size(max = 50, message = "Employee ID must not exceed 50 characters")
    private String employeeId;

    @Size(max = 50, message = "Employee code must not exceed 50 characters")
    private String employeeCode;

    @Size(max = 50, message = "Contract code must not exceed 50 characters")
    private String contractCode;

    @Size(max = 50, message = "Contract type must not exceed 50 characters")
    private String contractType;

    @Size(max = 255, message = "Permanent address must not exceed 255 characters")
    private String permanentAddress;

    @Size(max = 255, message = "Temporary address must not exceed 255 characters")
    private String temporaryAddress;
}

