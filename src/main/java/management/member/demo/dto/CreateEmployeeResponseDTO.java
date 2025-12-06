package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class CreateEmployeeResponseDTO {
    private EmployeeData data;
    private boolean success = true;
    private String message;

    @Getter
    @Setter
    public static class EmployeeData {
        private String id;  // employeeId
        // FE có thể gửi name hoặc firstName/lastName
        @Size(max = 200, message = "Name must not exceed 200 characters")
        private String name; // firstName + lastName (FE có thể gửi)

        @Size(max = 100, message = "First name must not exceed 100 characters")
        private String firstName; // FE có thể gửi trực tiếp

        @Size(max = 100, message = "Last name must not exceed 100 characters")
        private String lastName; // FE có thể gửi trực tiếp

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

        // FE có thể gửi gender_vi (Nam/Nữ) hoặc gender (male/female)
        // Normalizer sẽ convert về male/female
        @Size(max = 20, message = "Gender must not exceed 20 characters")
        private String gender; // FE có thể gửi "Nam"/"Nữ" hoặc "male"/"female"

        @Size(max = 20, message = "ID number must not exceed 20 characters")
        private String idNumber; // CMND/CCCD

        @Size(max = 20, message = "Tax code must not exceed 20 characters")
        private String taxCode;

        @Size(max = 50, message = "Employee ID must not exceed 50 characters")
        private String employeeId;

        @Size(max = 50, message = "Contract code must not exceed 50 characters")
        private String contractCode;

        // FE có thể gửi contract hoặc contractType
        // Normalizer sẽ convert Vietnamese → English
        @Size(max = 50, message = "Contract type must not exceed 50 characters")
        private String contractType; // FE có thể gửi Vietnamese hoặc English

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

        @JsonFormat(pattern = "HH:mm")
        private LocalTime timeIn;

        @JsonFormat(pattern = "HH:mm")
        private LocalTime timeOut;

        @Size(max = 50, message = "Shift must not exceed 50 characters")
        private String shift;

        @Size(max = 255, message = "Work location must not exceed 255 characters")
        private String workLocation;
    }
}

