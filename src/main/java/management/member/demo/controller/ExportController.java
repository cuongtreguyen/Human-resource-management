package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import management.member.demo.dto.ExportResponseDTO;
import management.member.demo.service.AttendanceService;
import management.member.demo.service.EmployeeService;
import management.member.demo.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export")
@Tag(name = "Export", description = "Data export endpoints")
public class ExportController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private PayrollService payrollService;

    @GetMapping("/employees")
    @Operation(summary = "Export employees", description = "Export employee data to file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export completed successfully")
    })
    public ResponseEntity<ExportResponseDTO> exportEmployees(
            @RequestParam(required = false, defaultValue = "csv") String format,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status) {
        ExportResponseDTO response = employeeService.exportEmployees(format, search, department, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/attendance")
    @Operation(summary = "Export attendance", description = "Export attendance data to file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export completed successfully")
    })
    public ResponseEntity<ExportResponseDTO> exportAttendance(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        ExportResponseDTO response = attendanceService.exportAttendance(startDate, endDate, format);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/payroll")
    @Operation(summary = "Export payroll", description = "Export payroll data to file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export completed successfully")
    })
    public ResponseEntity<ExportResponseDTO> exportPayroll(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String year,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        ExportResponseDTO response = payrollService.exportPayroll(month, null, format);
        return ResponseEntity.ok(response);
    }
}

