package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class UpdateEmployeeRequest {
    private String firstName;
    
    private String lastName;
    
    @Email(message = "Email must be valid")
    @Size(max = 120, message = "Email must not exceed 120 characters")
    private String email;
    
    @Size(max = 30, message = "Phone must not exceed 30 characters")
    private String phone;
    
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    @Pattern(regexp = "male|female", message = "Gender must be male or female")
    private String gender;
    
    @Size(max = 50, message = "Employee ID must not exceed 50 characters")
    private String employeeId;
    
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;
    
    @Size(max = 100, message = "Position must not exceed 100 characters")
    private String position;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;  // Maps to hireDate
    
    @Pattern(regexp = "active|inactive|on_leave|terminated", 
             message = "Status must be one of: active, inactive, on_leave, terminated")
    private String status;
    
    @Size(max = 100, message = "Manager must not exceed 100 characters")
    private String manager;  // Not in entity, will be stored in notes or separate field
    
    @DecimalMin(value = "0.0", message = "Salary must be greater than or equal to 0")
    private BigDecimal salary;  // Maps to baseSalary (optional for partial update)
    
    @Size(max = 50, message = "Pay grade must not exceed 50 characters")
    private String payGrade;  // Not in entity, will be stored in notes or separate field
    
    @Size(max = 500, message = "Benefits must not exceed 500 characters")
    private String benefits;  // Not in entity, will be stored in notes or separate field
    
    @Size(max = 100, message = "Emergency contact must not exceed 100 characters")
    private String emergencyContact;  // Not in entity, will be stored in notes or separate field
    
    @Size(max = 30, message = "Emergency phone must not exceed 30 characters")
    private String emergencyPhone;  // Not in entity, will be stored in notes or separate field
    
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;  // Not in entity, will be stored in notes or separate field
}

