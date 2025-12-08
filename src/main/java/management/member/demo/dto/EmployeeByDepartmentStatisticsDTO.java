package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * DTO cho thống kê số lượng nhân viên theo phòng ban
 */
@Getter
@Setter
public class EmployeeByDepartmentStatisticsDTO {
    /** Danh sách thống kê theo từng phòng ban */
    private List<DepartmentStatistics> departments;

    /**
     * Nested class cho thống kê từng phòng ban
     */
    @Getter
    @Setter
    public static class DepartmentStatistics {
        /** Tên phòng ban */
        private String department;
        
        /** Số lượng nhân viên trong phòng ban */
        private Long employeeCount;
    }
}

