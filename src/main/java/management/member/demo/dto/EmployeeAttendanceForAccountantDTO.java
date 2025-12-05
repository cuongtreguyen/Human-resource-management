package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.AttendenceStatus;

import java.time.LocalTime;

/**
 * DTO cho danh sách nhân viên đã chấm công dành cho Accountant
 */
@Getter
@Setter
public class EmployeeAttendanceForAccountantDTO {
    private String employeeId;
    private String fullName;
    private String department;
    private String shift;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private AttendenceStatus status;
}

