package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.Enum.EmployeeStatus;

import java.time.LocalDate;

/**
 * Profile Response DTO - Thông tin profile của employee
 * Bao gồm thông tin liên hệ và thông tin công việc
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    // Thông tin cơ bản
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address; // Có thể null hoặc "Chưa cập nhật"
    
    // Thông tin công việc
    private String employeeCode;
    private String department;
    private String position;
    private LocalDate hireDate;
    private EmployeeStatus status;
}

