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
    
    // Additional fields for Frontend
    private LocalDate dateOfBirth;
    private String gender;
    private String nationality;
    private String idCard;  // Maps to idNumber in entity
    private String address;  // Maps to permanentAddress in entity
    private String maritalStatus;
    private String employeeType;
    private String contractType;
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

