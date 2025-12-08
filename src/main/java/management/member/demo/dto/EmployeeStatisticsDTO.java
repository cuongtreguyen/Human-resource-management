package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO cho thống kê nhân viên và chấm công
 * Chứa 8 thống kê chính:
 * 1. Đếm nhân viên có trạng thái hoạt động
 * 2. Đếm nhân viên mới được add vào trong tháng
 * 3. Đếm số đơn nghỉ phép và số đơn chờ duyệt
 * 4. Đếm tổng lương thực nhận của tất cả nhân viên trong tháng
 * 5. Đếm nhân viên check in đúng giờ
 * 6. Đếm nhân viên check in trễ
 * 7. Đếm nhân viên vắng mặt
 * 8. Tỷ lệ chấm công trung bình
 */
@Getter
@Setter
public class EmployeeStatisticsDTO {
    /** Đếm nhân viên có trạng thái hoạt động (ACTIVE) */
    private Long activeEmployees;
    
    /** Đếm nhân viên mới được add vào trong tháng (tháng hiện tại) */
    private Long newEmployeesThisMonth;
    
    /** Đếm số đơn nghỉ phép và số đơn chờ duyệt */
    private LeaveRequestsStatistics leaveRequests;
    
    /** Đếm tổng lương thực nhận (netSalary) của tất cả nhân viên trong tháng */
    private BigDecimal totalNetSalaryThisMonth;
    
    /** Đếm nhân viên check in đúng giờ trong tháng */
    private Long onTimeCheckInsThisMonth;
    
    /** Đếm nhân viên check in trễ trong tháng */
    private Long lateCheckInsThisMonth;
    
    /** Đếm nhân viên vắng mặt trong tháng (tổng số ngày vắng mặt) */
    private Long absentEmployeesThisMonth;
    
    /** Tỷ lệ chấm công trung bình trong tháng (0-100) */
    private BigDecimal averageAttendanceRateThisMonth;
    
    /**
     * Nested class cho thống kê đơn nghỉ phép
     */
    @Getter
    @Setter
    public static class LeaveRequestsStatistics {
        /** Tổng số đơn nghỉ phép */
        private Long totalLeaveRequests;
        
        /** Số đơn chờ duyệt (status = PENDING) */
        private Long pendingLeaveRequests;
    }
}

