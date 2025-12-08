package management.member.demo.controller;

import management.member.demo.dto.EmployeeByDepartmentStatisticsDTO;
import management.member.demo.dto.EmployeeStatisticsDTO;
import management.member.demo.dto.WeeklyAttendanceStatisticsDTO;
import management.member.demo.service.PayrollStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/admin-statistics")
@Tag(name = "Admin Statistics", description = "Admin statistics endpoints for employee and attendance management")
public class AdminStatisticsController {

    @Autowired
    private PayrollStatisticsService payrollStatisticsService;

    @GetMapping("")
    @Operation(
            summary = "Get employee statistics",
            description = "Lấy tất cả thống kê nhân viên và chấm công bao gồm: " +
                    "1. Đếm nhân viên có trạng thái hoạt động, " +
                    "2. Đếm nhân viên mới được add vào trong tháng, " +
                    "3. Đếm số đơn nghỉ phép và số đơn chờ duyệt, " +
                    "4. Đếm tổng lương thực nhận của tất cả nhân viên trong tháng, " +
                    "5. Đếm nhân viên check in đúng giờ, " +
                    "6. Đếm nhân viên check in trễ, " +
                    "7. Đếm nhân viên vắng mặt, " +
                    "8. Tỷ lệ chấm công trung bình"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<EmployeeStatisticsDTO> getEmployeeStatistics() {
        EmployeeStatisticsDTO statistics = payrollStatisticsService.getEmployeeStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/weekly-attendance")
    @Operation(
            summary = "Get weekly attendance statistics",
            description = "Lấy thống kê attendance (đúng giờ, trễ, vắng mặt) của tất cả nhân viên " +
                    "chia theo từng ngày trong 1 tuần (7 ngày gần nhất). " +
                    "Mỗi ngày bao gồm: số nhân viên check in đúng giờ, số nhân viên check in trễ, số nhân viên vắng mặt"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<WeeklyAttendanceStatisticsDTO> getWeeklyAttendanceStatistics() {
        WeeklyAttendanceStatisticsDTO statistics = payrollStatisticsService.getWeeklyAttendanceStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/employees-by-department")
    @Operation(
            summary = "Count employees by department",
            description = "Đếm số lượng nhân viên theo từng phòng ban"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<EmployeeByDepartmentStatisticsDTO> countEmployeesByDepartment() {
        EmployeeByDepartmentStatisticsDTO statistics = payrollStatisticsService.countEmployeesByDepartment();
        return ResponseEntity.ok(statistics);
    }
}

