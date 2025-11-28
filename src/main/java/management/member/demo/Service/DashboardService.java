package management.member.demo.Service;

import management.member.demo.Enum.EmployeeStatus;
import management.member.demo.Enum.OnLeaveStatus;
import management.member.demo.Enum.PayrollStatus;
import management.member.demo.dto.DashboardStatsResponseDTO;
import management.member.demo.entity.Attendance;
import management.member.demo.entity.Employee;
import management.member.demo.repository.AttendanceRepository;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.OnLeaveRepository;
import management.member.demo.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private OnLeaveRepository onLeaveRepository;


    public DashboardStatsResponseDTO getDashboardStats() {
        DashboardStatsResponseDTO stats = new DashboardStatsResponseDTO();

        // Total employees
        Long totalEmployees = employeeRepository.count();
        stats.setTotalEmployees(totalEmployees.intValue());

        // Active employees
        Long activeEmployees = employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
        stats.setActiveEmployees(activeEmployees.intValue());

        // New hires this month
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        Long newHires = employeeRepository.findAll().stream()
                .filter(emp -> emp.getHireDate() != null && 
                        emp.getHireDate().isAfter(firstDayOfMonth.minusDays(1)))
                .count();
        stats.setNewHiresThisMonth(newHires.intValue());

        // Employees on leave
        LocalDate today = LocalDate.now();
        Long onLeave = onLeaveRepository.findAll().stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED &&
                        leave.getStartDate() != null && leave.getEndDate() != null &&
                        !today.isBefore(leave.getStartDate()) && !today.isAfter(leave.getEndDate()))
                .count();
        stats.setEmployeesOnLeave(onLeave.intValue());

        // Pending payroll
        Long pendingPayroll = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PENDING)
                .count();
        stats.setPendingPayroll(pendingPayroll.intValue());

        // Completed payroll
        Long completedPayroll = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID)
                .count();
        stats.setCompletedPayroll(completedPayroll.intValue());

        // Average attendance (last 30 days)
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<Attendance> recentAttendances = attendanceRepository.findAll().stream()
                .filter(a -> a.getAttendanceDate() != null && !a.getAttendanceDate().isBefore(thirtyDaysAgo))
                .collect(Collectors.toList());
        
        long totalDays = recentAttendances.size();
        long presentDays = recentAttendances.stream()
                .filter(a -> a.getCheckIn() != null)
                .count();
        
        double avgAttendance = totalDays > 0 ? (presentDays * 100.0 / totalDays) : 0.0;
        stats.setAverageAttendance(Math.round(avgAttendance * 10.0) / 10.0);

        // Department counts
        Map<String, Long> deptCounts = employeeRepository.findAll().stream()
                .filter(emp -> emp.getDepartment() != null)
                .collect(Collectors.groupingBy(
                        Employee::getDepartment,
                        Collectors.counting()
                ));
        
        List<DashboardStatsResponseDTO.DepartmentCount> departments = deptCounts.entrySet().stream()
                .map(entry -> {
                    DashboardStatsResponseDTO.DepartmentCount dept = new DashboardStatsResponseDTO.DepartmentCount();
                    dept.setName(entry.getKey());
                    dept.setCount(entry.getValue().intValue());
                    return dept;
                })
                .collect(Collectors.toList());
        stats.setDepartments(departments);

        // Recent activities (from audit logs or notifications)
        List<DashboardStatsResponseDTO.RecentActivity> recentActivities = new ArrayList<>();
        // This would typically come from AuditLogService or NotificationService
        // For now, creating sample data
        for (int i = 0; i < 5; i++) {
            DashboardStatsResponseDTO.RecentActivity activity = new DashboardStatsResponseDTO.RecentActivity();
            activity.setId((long) (i + 1));
            activity.setType("activity");
            activity.setMessage("Recent activity " + (i + 1));
            activity.setTime(LocalDateTime.now().minusHours(i).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            recentActivities.add(activity);
        }
        stats.setRecentActivities(recentActivities);

        return stats;
    }
}

