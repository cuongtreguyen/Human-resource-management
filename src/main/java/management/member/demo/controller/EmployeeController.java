package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.Service.EmployeeService;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.EmployeeSearchFilterRequest;
import management.member.demo.dto.ProfileResponse;
import management.member.demo.dto.ProfileUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employees")
@Tag(name = "Employee", description = "Employee management endpoints")
public class EmployeeController {

    private final EmployeeService service;

    @Autowired
    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    // Lấy danh sách tất cả nhân viên bao gồm: Employee Name, Department, Position, Start Date, Monthly Salary, Status
    @GetMapping
    @Operation(
            summary = "Get all employees list",
            description = "Lấy danh sách tất cả nhân viên bao gồm: Employee Name, Department, Position, Start Date, Monthly Salary, Status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(service.getAllEmployees());
    }

    // Đếm tổng số lượng nhân viên trong hệ thống
    @GetMapping("/total")
    @Operation(
            summary = "Get total employees count",
            description = "Đếm tổng số lượng nhân viên trong hệ thống"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<Map<String, Object>> getTotalEmployees() {
        Long total = service.getTotalEmployees();
        return ResponseEntity.ok(Map.of("totalEmployees", total));
    }

    // Đếm số lượng nhân viên đang hoạt động (status = ACTIVE)
    @GetMapping("/active/count")
    @Operation(
            summary = "Get active employees count",
            description = "Đếm số lượng nhân viên đang hoạt động (status = ACTIVE)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<Map<String, Object>> getActiveEmployeesCount() {
        Long activeCount = service.getActiveEmployeesCount();
        return ResponseEntity.ok(Map.of("activeEmployeesCount", activeCount));
    }

    // Tìm kiếm và lọc nhân viên theo các tiêu chí: Department, Position, Salary Range
    @PostMapping("/search")
    @Operation(
            summary = "Search and filter employees",
            description = "Tìm kiếm và lọc nhân viên theo các tiêu chí: Department, Position, Salary Range"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "400", description = "Invalid filter criteria")
    })
    public ResponseEntity<List<EmployeeResponse>> searchAndFilterEmployees(
            @RequestBody(required = false) EmployeeSearchFilterRequest filterRequest) {
        return ResponseEntity.ok(service.searchAndFilterEmployees(filterRequest));
    }

    // Lấy thông tin nhân viên theo ID
    @GetMapping("/{id}")
    @Operation(summary = "Get employee by id", description = "Get employee information by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeeResponse> getEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(service.getEmployeeById(id));
    }

    // Cập nhật thông tin nhân viên theo ID
    @PutMapping("/{id}")
    @Operation(summary = "Update employee", description = "Update employee information by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(service.updateEmployee(id, request));
    }

    // Lấy thông tin profile của nhân viên theo ID (bao gồm thông tin liên hệ và công việc)
    @GetMapping("/{id}/profile")
    @Operation(summary = "Get employee profile", description = "Get employee profile information including contact and work details")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProfile(id));
    }

    // Cập nhật profile của nhân viên theo ID (chỉ cho phép update thông tin liên hệ)
    @PutMapping("/{id}/profile")
    @Operation(summary = "Update employee profile", description = "Update employee profile information (contact details only)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<ProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(service.updateProfile(id, request));
    }

    // Xóa nhân viên theo ID
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete employee",
            description = "Xóa nhân viên theo ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Employee deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid employee ID")
    })
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable Long id) {
        service.deleteEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Employee deleted successfully", "id", String.valueOf(id)));
    }
}

