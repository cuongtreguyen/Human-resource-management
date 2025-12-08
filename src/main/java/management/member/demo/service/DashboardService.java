package management.member.demo.service;

import management.member.demo.dto.DashboardStatsResponseDTO;
import management.member.demo.dto.StatisticsSummaryDTO;
import management.member.demo.dto.UpcomingTaskDTO;
import management.member.demo.dto.EmployeeEvaluationScoreDTO;
import management.member.demo.dto.WeeklyAttendancePercentageDTO;
import management.member.demo.enums.AttendenceStatus;
import management.member.demo.enums.EmployeeStatus;
import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.enums.OverTimeStatus;
import management.member.demo.enums.PayrollStatus;
import management.member.demo.enums.TaskStatus;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.OnLeaveRepository;
import management.member.demo.repository.PayrollRepository;
import management.member.demo.repository.AttendanceRepository;
import management.member.demo.repository.AuditLogRepository;
import management.member.demo.repository.TaskRepository;
import management.member.demo.repository.OverTimeRepository;
import management.member.demo.repository.EvaluationRepository;
import management.member.demo.entity.AuditLog;
import management.member.demo.entity.Task;
import management.member.demo.entity.Evaluation;
import management.member.demo.entity.Attendance;
import management.member.demo.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OnLeaveRepository onLeaveRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private OverTimeRepository overTimeRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    public DashboardStatsResponseDTO getDashboardStats() {
        DashboardStatsResponseDTO stats = new DashboardStatsResponseDTO();
        DashboardStatsResponseDTO.DashboardData data = new DashboardStatsResponseDTO.DashboardData();

        // Total employees
        long totalEmployees = employeeRepository.count();
        data.setTotalEmployees((int) totalEmployees);

        // Active employees
        long activeEmployees = employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
        data.setActiveEmployees((int) activeEmployees);

        // New hires this month
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        long newHiresThisMonth = employeeRepository.findAll().stream()
                .filter(e -> e.getHireDate() != null &&
                        e.getHireDate().isAfter(firstDayOfMonth.minusDays(1)) &&
                        e.getHireDate().isBefore(LocalDate.now().plusDays(1)))
                .count();
        data.setNewHiresThisMonth((int) newHiresThisMonth);

        // Employees on leave
        long employeesOnLeave = onLeaveRepository.count();
        data.setEmployeesOnLeave((int) employeesOnLeave);

        // Payroll stats
        long pendingPayroll = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() != null && p.getStatus() == PayrollStatus.PENDING)
                .count();
        data.setPendingPayroll((int) pendingPayroll);

        long completedPayroll = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() != null && p.getStatus() == PayrollStatus.PAID)
                .count();
        data.setCompletedPayroll((int) completedPayroll);

        // Average attendance (mock calculation)
        long todayAttendance = attendanceRepository.findByAttendanceDate(LocalDate.now()).size();
        double averageAttendance = totalEmployees > 0 ? (double) todayAttendance / totalEmployees * 100 : 0.0;
        data.setAverageAttendance(averageAttendance);

        // Departments
        List<DashboardStatsResponseDTO.DepartmentCount> departments = new ArrayList<>();
        // Group employees by department
        employeeRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        e -> e.getDepartment() != null ? e.getDepartment() : "Unknown",
                        java.util.stream.Collectors.counting()))
                .forEach((deptName, count) -> {
                    DashboardStatsResponseDTO.DepartmentCount dept = new DashboardStatsResponseDTO.DepartmentCount();
                    dept.setName(deptName);
                    dept.setCount(count.intValue());
                    departments.add(dept);
                });
        data.setDepartments(departments);

        // Recent activities from AuditLog
        List<DashboardStatsResponseDTO.RecentActivity> recentActivities = new ArrayList<>();
        List<AuditLog> recentLogs = auditLogRepository.findAll(
                PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "timestamp"))
        ).getContent();
        
        for (AuditLog log : recentLogs) {
            DashboardStatsResponseDTO.RecentActivity activity = new DashboardStatsResponseDTO.RecentActivity();
            activity.setId(log.getId());
            activity.setType(log.getAction() != null ? log.getAction().toLowerCase() : "unknown");
            activity.setMessage(log.getDetails() != null ? log.getDetails() : "Activity");
            
            // Calculate relative time
            if (log.getTimestamp() != null) {
                long hoursAgo = ChronoUnit.HOURS.between(log.getTimestamp(), LocalDateTime.now());
                long minutesAgo = ChronoUnit.MINUTES.between(log.getTimestamp(), LocalDateTime.now());
                
                if (hoursAgo < 1) {
                    activity.setTime(minutesAgo + " phút trước");
                } else if (hoursAgo < 24) {
                    activity.setTime(hoursAgo + " giờ trước");
                } else {
                    long daysAgo = ChronoUnit.DAYS.between(log.getTimestamp(), LocalDateTime.now());
                    activity.setTime(daysAgo + " ngày trước");
                }
            } else {
                activity.setTime("Vừa xong");
            }
            
            recentActivities.add(activity);
        }
        data.setRecentActivities(recentActivities);
        
        stats.setData(data);

        return stats;
    }

    /**
     * Lấy tất cả thống kê tổng hợp:
     * - Tổng số nhân viên
     * - Tổng số nhân viên hiện tại (active và inwork)
     * - Tổng số đơn nghỉ phép có trạng thái pending
     * - Tổng số công việc đang thực hiện
     * - Tổng số đơn trạng thái quá hạn (trễ ngày deadline)
     * - Tổng số đơn OT đang chờ xử lý
     * - Tổng số nhân viên đang nghỉ phép (ngày hiện tại)
     * - Tổng số nhân viên vắng mặt hôm nay
     */
    public StatisticsSummaryDTO getStatisticsSummary() {
        StatisticsSummaryDTO summary = new StatisticsSummaryDTO();

        // 1. Tổng số nhân viên
        long totalEmployees = employeeRepository.count();
        summary.setTotalEmployees(totalEmployees);

        // 2. Tổng số nhân viên hiện tại (active và inwork)
        // InWork: nhân viên có attendance hôm nay với status IN_WORK hoặc LATE (đang làm việc)
        LocalDate today = LocalDate.now();
        List<Attendance> todayAttendances = attendanceRepository.findByAttendanceDate(today);
        Set<Long> inWorkEmployeeIds = todayAttendances.stream()
                .filter(a -> a.getStatus() == AttendenceStatus.IN_WORK || a.getStatus() == AttendenceStatus.LATE)
                .map(a -> a.getEmployee() != null ? a.getEmployee().getId() : null)
                .filter(id -> id != null)
                .collect(Collectors.toSet());
        
        // Tính tổng: active employees + inwork employees (không trùng lặp)
        // Lấy tất cả employee IDs có status ACTIVE
        Set<Long> activeEmployeeIds = employeeRepository.findByStatus(EmployeeStatus.ACTIVE).stream()
                .map(e -> e.getId())
                .collect(Collectors.toSet());
        
        // Hợp nhất: active + inwork (loại bỏ trùng lặp)
        Set<Long> currentActiveEmployeeIds = new java.util.HashSet<>(activeEmployeeIds);
        currentActiveEmployeeIds.addAll(inWorkEmployeeIds);
        
        long currentActiveEmployees = currentActiveEmployeeIds.size();
        summary.setCurrentActiveEmployees(currentActiveEmployees);

        // 3. Tổng số đơn nghỉ phép có trạng thái pending
        long pendingLeaveRequests = onLeaveRepository.countByOnLeaveStatus(OnLeaveStatus.PENDING);
        summary.setPendingLeaveRequests(pendingLeaveRequests);

        // 4. Tổng số công việc đang thực hiện
        long inProgressTasks = taskRepository.countByTaskStatus(TaskStatus.IN_PROGRESS);
        summary.setInProgressTasks(inProgressTasks);

        // 5. Tổng số đơn trạng thái quá hạn (deadline < hiện tại và status != COMPLETED)
        long overdueTasks = taskRepository.countOverdueTasks(LocalDate.now(), TaskStatus.COMPLETED);
        summary.setOverdueTasks(overdueTasks);

        // 6. Tổng số đơn OT đang chờ xử lý
        long pendingOvertimeRequests = overTimeRepository.countByOvertimeStatus(OverTimeStatus.PENDING);
        summary.setPendingOvertimeRequests(pendingOvertimeRequests);

        // 7. Tổng số nhân viên đang nghỉ phép (ngày hiện tại)
        // Lấy tất cả OnLeave APPROVED và filter trong code để đảm bảo tính chính xác
        Set<Long> employeesOnLeaveTodaySet = onLeaveRepository.findAll().stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED &&
                        leave.getStartDate() != null &&
                        leave.getEndDate() != null &&
                        leave.getEmployee() != null &&
                        !leave.getStartDate().isAfter(today) &&
                        !leave.getEndDate().isBefore(today))
                .map(leave -> leave.getEmployee().getId())
                .collect(Collectors.toSet());
        long employeesOnLeaveToday = employeesOnLeaveTodaySet.size();
        summary.setEmployeesOnLeaveToday(employeesOnLeaveToday);

        // 8. Tổng số nhân viên vắng mặt hôm nay
        // Logic: ACTIVE employees không có attendance hôm nay HOẶC có attendance với status = NOT_CHECKED_IN
        // Và không có OnLeave APPROVED hôm nay
        // Chỉ đếm trong ngày làm việc (không phải cuối tuần)
        // Loại trừ nhân viên có attendance với status IN_WORK, LATE, OUT_WORK (đã làm việc)
        java.time.DayOfWeek dayOfWeek = today.getDayOfWeek();
        boolean isWeekend = (dayOfWeek == java.time.DayOfWeek.SATURDAY || dayOfWeek == java.time.DayOfWeek.SUNDAY);
        
        long absentEmployeesToday = 0;
        
        // Chỉ đếm vắng mặt trong ngày làm việc (không phải cuối tuần)
        if (!isWeekend) {
            List<Employee> activeEmployees = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
            
            // Lấy danh sách employee IDs có OnLeave APPROVED hôm nay (để loại trừ)
            Set<Long> onLeaveEmployeeIds = onLeaveRepository.findAll().stream()
                    .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED &&
                            leave.getStartDate() != null &&
                            leave.getEndDate() != null &&
                            !leave.getStartDate().isAfter(today) &&
                            !leave.getEndDate().isBefore(today) &&
                            leave.getEmployee() != null)
                    .map(leave -> leave.getEmployee().getId())
                    .collect(Collectors.toSet());
            
            // Lấy danh sách employee IDs có attendance hôm nay với checkIn != null (đã check-in)
            Set<Long> checkedInEmployeeIds = todayAttendances.stream()
                    .filter(a -> a.getEmployee() != null && a.getCheckIn() != null)
                    .map(a -> a.getEmployee().getId())
                    .collect(Collectors.toSet());
            
            // Đếm nhân viên vắng mặt:
            // - ACTIVE employees
            // - Đã được thuê (hireDate <= today hoặc hireDate == null)
            // - Không có OnLeave APPROVED hôm nay
            // - Không có check-in (không có attendance HOẶC có attendance nhưng checkIn == null)
            absentEmployeesToday = activeEmployees.stream()
                    .filter(emp -> {
                        // Loại trừ nhân viên chưa được thuê
                        if (emp.getHireDate() != null && emp.getHireDate().isAfter(today)) {
                            return false;
                        }
                        // Loại trừ nhân viên có OnLeave APPROVED hôm nay
                        if (onLeaveEmployeeIds.contains(emp.getId())) {
                            return false;
                        }
                        // Loại trừ nhân viên đã check-in (có checkIn != null)
                        if (checkedInEmployeeIds.contains(emp.getId())) {
                            return false;
                        }
                        // Tất cả các trường hợp còn lại = vắng mặt
                        // (không có attendance record HOẶC có attendance nhưng checkIn == null)
                        return true;
                    })
                    .count();
        }
        
        summary.setAbsentEmployeesToday(absentEmployeesToday);

        // 9. Các task sắp đến hạn (cách deadline 1 ngày mà trạng thái chưa hoàn thành)
        LocalDate tomorrow = today.plusDays(1);
        List<Task> upcomingTasks = taskRepository.findUpcomingTasks(tomorrow, TaskStatus.COMPLETED);
        List<UpcomingTaskDTO> upcomingTaskDTOs = upcomingTasks.stream()
                .map(task -> {
                    UpcomingTaskDTO dto = new UpcomingTaskDTO();
                    dto.setTitle(task.getTitle());
                    dto.setDeadline(task.getDeadline());
                    // Lấy tên nhân viên đầu tiên được giao task
                    if (task.getEmployees() != null && !task.getEmployees().isEmpty()) {
                        dto.setEmployeeName(task.getEmployees().get(0).getFullName());
                    } else {
                        dto.setEmployeeName("Chưa giao");
                    }
                    return dto;
                })
                .collect(Collectors.toList());
        summary.setUpcomingTasks(upcomingTaskDTOs);

        // 10. Tất cả nhân viên và điểm đánh giá (tính phần trăm)
        List<Employee> allEmployees = employeeRepository.findAll();
        List<EmployeeEvaluationScoreDTO> evaluationScores = allEmployees.stream()
                .map(emp -> {
                    EmployeeEvaluationScoreDTO dto = new EmployeeEvaluationScoreDTO();
                    dto.setEmployeeName(emp.getFullName());
                    
                    // Lấy điểm trung bình từ Evaluation (lấy đánh giá mới nhất hoặc tính trung bình tất cả)
                    List<Evaluation> evaluations = evaluationRepository.findAll().stream()
                            .filter(eval -> eval.getEmployee() != null && 
                                    eval.getEmployee().getId().equals(emp.getId()))
                            .collect(Collectors.toList());
                    
                    if (evaluations.isEmpty()) {
                        dto.setPercentage(0.0);
                    } else {
                        // Tính trung bình của tất cả các đánh giá
                        double avgScore = evaluations.stream()
                                .mapToDouble(eval -> eval.getAverageScore() != null ? eval.getAverageScore() : 0.0)
                                .average()
                                .orElse(0.0);
                        // Tính phần trăm: (averageScore / 5) * 100
                        dto.setPercentage(Math.round((avgScore / 5.0) * 100.0 * 10.0) / 10.0);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
        summary.setEmployeeEvaluationScores(evaluationScores);

        // 11. Phần trăm chấm công của tuần hiện tại
        WeeklyAttendancePercentageDTO weeklyAttendance = calculateWeeklyAttendancePercentage(today);
        summary.setWeeklyAttendancePercentage(weeklyAttendance);

        return summary;
    }

    /**
     * Tính phần trăm chấm công của tuần hiện tại
     * Trả về từng ngày trong tuần (Monday-Sunday)
     * Chỉ tính các ngày đã qua (<= today), các ngày chưa đến trả về 0%
     */
    private WeeklyAttendancePercentageDTO calculateWeeklyAttendancePercentage(LocalDate today) {
        WeeklyAttendancePercentageDTO result = new WeeklyAttendancePercentageDTO();
        List<WeeklyAttendancePercentageDTO.DailyAttendancePercentage> dailyPercentages = new ArrayList<>();
        
        // Lấy thứ 2 của tuần hiện tại (Monday)
        java.time.DayOfWeek dayOfWeek = today.getDayOfWeek();
        int daysFromMonday = dayOfWeek.getValue() - 1; // Monday = 1, Sunday = 7
        LocalDate monday = today.minusDays(daysFromMonday);
        
        // Lấy tất cả nhân viên ACTIVE
        List<Employee> activeEmployees = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
        long totalEmployees = activeEmployees.size();
        
        // Tên các ngày trong tuần
        String[] dayNames = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
        
        // Tính cho từng ngày trong tuần (7 ngày)
        for (int i = 0; i < 7; i++) {
            LocalDate currentDate = monday.plusDays(i);
            WeeklyAttendancePercentageDTO.DailyAttendancePercentage daily = 
                    new WeeklyAttendancePercentageDTO.DailyAttendancePercentage();
            daily.setDayOfWeek(dayNames[i]);
            daily.setDate(currentDate);
            
            // Nếu ngày này chưa đến (sau hôm nay) thì trả về 0%
            if (currentDate.isAfter(today)) {
                daily.setPresentPercentage(0.0);
                daily.setAbsentPercentage(0.0);
                dailyPercentages.add(daily);
                continue;
            }
            
            // Tính phần trăm cho ngày này
            if (totalEmployees == 0) {
                daily.setPresentPercentage(0.0);
                daily.setAbsentPercentage(0.0);
            } else {
                // Lấy attendance của ngày này
                List<Attendance> dayAttendances = attendanceRepository.findByAttendanceDate(currentDate);
                
                // Lấy danh sách employee IDs có OnLeave APPROVED trong ngày này
                final LocalDate dateToCheck = currentDate; // Make effectively final for lambda
                Set<Long> onLeaveEmployeeIds = onLeaveRepository.findAll().stream()
                        .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED &&
                                leave.getStartDate() != null &&
                                leave.getEndDate() != null &&
                                !leave.getStartDate().isAfter(dateToCheck) &&
                                !leave.getEndDate().isBefore(dateToCheck) &&
                                leave.getEmployee() != null)
                        .map(leave -> leave.getEmployee().getId())
                        .collect(Collectors.toSet());
                
                // Đếm nhân viên có mặt (có check-in)
                long presentCount = activeEmployees.stream()
                        .filter(emp -> {
                            // Loại trừ nhân viên chưa được thuê
                            if (emp.getHireDate() != null && emp.getHireDate().isAfter(dateToCheck)) {
                                return false;
                            }
                            // Loại trừ nhân viên có OnLeave APPROVED
                            if (onLeaveEmployeeIds.contains(emp.getId())) {
                                return false;
                            }
                            // Kiểm tra có check-in không
                            return dayAttendances.stream()
                                    .anyMatch(a -> a.getEmployee() != null &&
                                            a.getEmployee().getId().equals(emp.getId()) &&
                                            a.getCheckIn() != null);
                        })
                        .count();
                
                // Đếm nhân viên vắng mặt
                long absentCount = activeEmployees.stream()
                        .filter(emp -> {
                            // Loại trừ nhân viên chưa được thuê
                            if (emp.getHireDate() != null && emp.getHireDate().isAfter(dateToCheck)) {
                                return false;
                            }
                            // Loại trừ nhân viên có OnLeave APPROVED
                            if (onLeaveEmployeeIds.contains(emp.getId())) {
                                return false;
                            }
                            // Kiểm tra không có check-in
                            return dayAttendances.stream()
                                    .noneMatch(a -> a.getEmployee() != null &&
                                            a.getEmployee().getId().equals(emp.getId()) &&
                                            a.getCheckIn() != null);
                        })
                        .count();
                
                // Đếm tổng số nhân viên phải đi làm (không tính nhân viên nghỉ phép và chưa được thuê)
                long totalEmployeesToWork = activeEmployees.stream()
                        .filter(emp -> {
                            // Loại trừ nhân viên chưa được thuê
                            if (emp.getHireDate() != null && emp.getHireDate().isAfter(dateToCheck)) {
                                return false;
                            }
                            // Loại trừ nhân viên có OnLeave APPROVED
                            if (onLeaveEmployeeIds.contains(emp.getId())) {
                                return false;
                            }
                            return true;
                        })
                        .count();
                
                // Tính phần trăm dựa trên số nhân viên phải đi làm (không tính nhân viên nghỉ phép)
                if (totalEmployeesToWork == 0) {
                    daily.setPresentPercentage(0.0);
                    daily.setAbsentPercentage(0.0);
                } else {
                    double presentPercentage = (double) presentCount / totalEmployeesToWork * 100.0;
                    double absentPercentage = (double) absentCount / totalEmployeesToWork * 100.0;
                    daily.setPresentPercentage(Math.round(presentPercentage * 10.0) / 10.0);
                    daily.setAbsentPercentage(Math.round(absentPercentage * 10.0) / 10.0);
                }
            }
            
            dailyPercentages.add(daily);
        }
        
        result.setDailyPercentages(dailyPercentages);
        return result;
    }
}

