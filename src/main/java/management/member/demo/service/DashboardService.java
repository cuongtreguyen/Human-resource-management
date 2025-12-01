package management.member.demo.service;

import management.member.demo.dto.DashboardStatsResponseDTO;
import management.member.demo.enums.EmployeeStatus;
import management.member.demo.enums.PayrollStatus;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.OnLeaveRepository;
import management.member.demo.repository.PayrollRepository;
import management.member.demo.repository.AttendanceRepository;
import management.member.demo.repository.AuditLogRepository;
import management.member.demo.entity.AuditLog;
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
}

