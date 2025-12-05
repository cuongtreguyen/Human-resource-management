package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.enums.OnLeaveType;

import java.time.LocalDate;

/**
 * DTO cho chi tiết đơn xin nghỉ phép dành cho Accountant
 */
@Getter
@Setter
public class LeaveApplicationDetailForAccountantDTO {
    private String employeeId;
    private String fullName;
    private String department;
    private OnLeaveType onLeaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private OnLeaveStatus onLeaveStatus;
    private LocalDate submittedDate;
    private Long totalDaysOnleave;
}

