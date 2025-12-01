package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    
    // Computed field: full name (firstName + lastName)
    @JsonProperty("name")
    private String name;
    
    private String email;
    private String phone;
    private String position;
    private String department;
    private String status;  // lowercase: active, inactive, on_leave, terminated
    private LocalDate hireDate;
    private BigDecimal salary;  // baseSalary
    private String personalEmail;
    private LocalDate dateOfBirth;
    
    // Gender: stored as "male"/"female" in DB, but can be mapped to Vietnamese in response
    private String gender;
    
    // Field name mapping: idNumber → idCard
    @JsonProperty("idCard")
    private String idNumber;
    
    private String taxCode;
    
    // Field name mapping: permanentAddress → address
    @JsonProperty("address")
    private String permanentAddress;
    
    private String temporaryAddress;
    private String employeeCode;
    private String contractCode;
    
    // ContractType: stored as "Full-time"/"Part-time" in DB, but can be mapped to Vietnamese in response
    private String contractType;
    
    // Additional fields for Frontend
    private String nationality;
    private String maritalStatus;
    private String employeeType;
    private String manager;
    private String workLocation;
    private String education;
    private String educationDetails;
    
    // Emergency contact as nested object
    private EmergencyContact emergencyContact;
    
    private String bankAccount;
    private String bankName;
    private String bankBranch;
    
    @Getter
    @Setter
    public static class EmergencyContact {
        private String name;
        private String relationship;
        private String phone;
    }
}

