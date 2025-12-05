package management.member.demo.controller;

import management.member.demo.dto.*;
import management.member.demo.dto.DashboardPayrollStatisticsDTO;
import management.member.demo.service.PayrollStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import management.member.demo.service.EmployeeService;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll-statistics")
@Tag(name = "Payroll Statistics", description = "Payroll statistics and analytics endpoints")
public class PayrollStatisticsController {

    @Autowired
    private PayrollStatisticsService payrollStatisticsService;

    @Autowired
    private EmployeeService employeeService;


    @GetMapping("/dashboard")
    @Operation(
            summary = "Get dashboard payroll statistics",
            description = "Lấy tất cả thống kê payroll cho Dashboard bao gồm totalPayroll, pendingPayroll, payrollGrowth, basicSalaryTotal, allowanceTotal, overtimeTotal, bonusTotal, deductionTotal, insuranceTotal, payrollByDepartment, monthlyPayroll, pendingPayrollList"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<DashboardPayrollStatisticsDTO> getDashboardPayrollStatistics() {
        DashboardPayrollStatisticsDTO dashboard = payrollStatisticsService.getDashboardPayrollStatistics();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/summary")
    @Operation(
            summary = "Get payroll summary statistics",
            description = "Lấy thống kê tổng hợp: totalEmployees, totalPayroll, totalOTPay, totalInsurance, totalTax"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<Map<String, Object>> getPayrollSummary() {
        Long totalEmployees = employeeService.getTotalEmployees();
        Map<String, Object> summary = payrollStatisticsService.getPayrollSummary(totalEmployees);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/filter-options")
    @Operation(
            summary = "Get filter options",
            description = "Lấy danh sách filter options: selectedDepartment (tất cả phòng ban) và selectedMonth (tất cả tháng có payroll)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<Map<String, Object>> getFilterOptions() {
        Map<String, Object> filters = payrollStatisticsService.getFilterOptions();
        return ResponseEntity.ok(filters);
    }
}

