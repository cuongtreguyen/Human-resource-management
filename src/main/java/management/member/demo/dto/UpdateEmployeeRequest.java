package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.converter.LocalTimeDeserializer;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class UpdateEmployeeRequest {
    private String name; // Added for FE compatibility

    private String firstName;
    
    private String lastName;
    
    @Pattern(regexp = "^$|^string$|^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Email must be valid")
    @Size(max = 120, message = "Email must not exceed 120 characters")
    private String email;
    
    @Size(max = 30, message = "Phone must not exceed 30 characters")
    private String phone;
    
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    @Pattern(regexp = "^$|male|female", message = "Gender must be male or female")
    private String gender;
    
    @Size(max = 50, message = "Employee ID must not exceed 50 characters")
    private String employeeId;
    
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;
    
    @Size(max = 100, message = "Position must not exceed 100 characters")
    private String position;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;  // Maps to hireDate
    
    @Pattern(regexp = "^$|active|inactive|on_leave|terminated", 
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

    @Pattern(regexp = "^$|^string$|^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Personal email must be valid")
    @Size(max = 120, message = "Personal email must not exceed 120 characters")
    private String personalEmail;

    @Size(max = 20, message = "ID number must not exceed 20 characters")
    private String idNumber; // CMND/CCCD - maps to idCard

    @Size(max = 20, message = "Tax code must not exceed 20 characters")
    private String taxCode;

    @Size(max = 50, message = "Contract code must not exceed 50 characters")
    private String contractCode;

    @Size(max = 50, message = "Contract type must not exceed 50 characters")
    private String contractType;

    @Size(max = 255, message = "Permanent address must not exceed 255 characters")
    private String permanentAddress;

    @Size(max = 255, message = "Temporary address must not exceed 255 characters")
    private String temporaryAddress;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate idCardIssueDate;

    @Size(max = 100, message = "ID card issue place must not exceed 100 characters")
    private String idCardIssuePlace;

    @Size(max = 50, message = "Marital status must not exceed 50 characters")
    private String maritalStatus;

    @Size(max = 50, message = "Employee type must not exceed 50 characters")
    private String employeeType;

    @Size(max = 100, message = "Emergency contact name must not exceed 100 characters")
    private String emergencyContactName;

    @Size(max = 30, message = "Emergency contact phone must not exceed 30 characters")
    private String emergencyContactPhone;

    @Size(max = 50, message = "Emergency contact relationship must not exceed 50 characters")
    private String emergencyContactRelationship;

    @JsonDeserialize(using = LocalTimeDeserializer.class)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime timeIn;

    @JsonDeserialize(using = LocalTimeDeserializer.class)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime timeOut;

    @Size(max = 50, message = "Shift must not exceed 50 characters")
    private String shift;

    @Size(max = 255, message = "Work location must not exceed 255 characters")
    private String workLocation;

    @Pattern(regexp = "^$|ADMIN|EMPLOYEE|MANAGER|ACCOUNTANT", message = "Role must be one of: ADMIN, EMPLOYEE, MANAGER, ACCOUNTANT")
    private String role;
}

