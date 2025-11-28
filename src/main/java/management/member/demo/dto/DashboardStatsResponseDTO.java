package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DashboardStatsResponseDTO {
    private Integer totalEmployees;
    private Integer activeEmployees;
    private Integer newHiresThisMonth;
    private Integer employeesOnLeave;
    private Integer pendingPayroll;
    private Integer completedPayroll;
    private Double averageAttendance;
    private List<DepartmentCount> departments;
    private List<RecentActivity> recentActivities;
    
    @Getter
    @Setter
    public static class DepartmentCount {
        private String name;
        private Integer count;
    }
    
    @Getter
    @Setter
    public static class RecentActivity {
        private Long id;
        private String type;
        private String message;
        private String time;
    }
}

