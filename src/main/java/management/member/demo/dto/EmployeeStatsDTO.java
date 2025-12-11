package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho thống kê nhân viên
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeStatsDTO {
    private Long totalEmployees;
    private Long activeEmployees;
}

