package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.enums.EmployeeStatus;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Profile Response DTO - Thông tin profile của employee
 * Bao gồm thông tin liên hệ và thông tin công việc
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private ProfileData data;
    private boolean success = true;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileData {
        // Thông tin cơ bản
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String gender;
        private EmployeeStatus status;
        
        // Thông tin công việc
        private String department;
        private String position;
        private String employeeId;
        
        // Thông tin CMND/CCCD
        private LocalDate idCardIssueDate;
        private String idCardIssuePlace;
        
        // Thông tin cá nhân
        private String maritalStatus;
        private String taxCode;
        private String contractCode;
        private EmployeeStatus employeeType;
        
        // Thông tin liên hệ khẩn cấp
        private String emergencyContactName;
        private String emergencyContactPhone;
        private String emergencyContactRelationship;
        
        // Thông tin làm việc
        private LocalTime timeIn;
        private LocalTime timeOut;
        private String shift;
        
        // Địa chỉ
        private String permanentAddress;
        private String temporaryAddress;
    }
}

