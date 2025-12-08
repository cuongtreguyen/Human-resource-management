package management.member.demo.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StatisticsSummaryDTO {
    Long totalEmployees; // Tổng số nhân viên
    Long currentActiveEmployees; // Tổng số nhân viên hiện tại (active và inwork)
    Long pendingLeaveRequests; // Tổng số đơn nghỉ phép có trạng thái pending
    Long inProgressTasks; // Tổng số công việc đang thực hiện
    Long overdueTasks; // Tổng số đơn trạng thái quá hạn (trễ ngày deadline)
    Long pendingOvertimeRequests; // Tổng số đơn OT đang chờ xử lý
    Long employeesOnLeaveToday; // Tổng số nhân viên đang nghỉ phép (ngày hiện tại)
    Long absentEmployeesToday; // Tổng số nhân viên vắng mặt hôm nay
    
    // Các task sắp đến hạn (cách deadline 1 ngày mà trạng thái chưa hoàn thành)
    List<UpcomingTaskDTO> upcomingTasks;
    
    // Tất cả nhân viên và điểm đánh giá (tính phần trăm)
    List<EmployeeEvaluationScoreDTO> employeeEvaluationScores;
    
    // Phần trăm chấm công của tuần hiện tại
    WeeklyAttendancePercentageDTO weeklyAttendancePercentage;
}

