package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.enums.OnLeaveType;

import java.time.LocalDate;

/**
 * DTO cho danh sách đơn xin nghỉ phép dành cho Accountant
 */
@Getter
@Setter
public class LeaveApplicationForAccountantDTO {
    private String employeeId;
    private String fullName;
    private String department;
    private OnLeaveType onLeaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private OnLeaveStatus onLeaveStatus;
    private Long totalDaysOnleave;
}

