package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.service.EmployeeService;
import management.member.demo.dto.AddEmployeeRequest;
import management.member.demo.dto.CreateEmployeeResponseDTO;
import management.member.demo.dto.DeleteEmployeeResponseDTO;
import management.member.demo.dto.EmployeeDetailDTO;
import management.member.demo.dto.EmployeeDetailResponse;
import management.member.demo.dto.EmployeeListResponse;
import management.member.demo.dto.EmployeeStatsDTO;
import management.member.demo.dto.SeniorityDTO;
import management.member.demo.dto.UpdateEmployeeRequest;
import management.member.demo.dto.UpdateEmployeeResponseDTO;
import management.member.demo.normalizer.EmployeeRequestNormalizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee", description = "Employee management endpoints")
public class EmployeeController {

    private final EmployeeService service;
    private final EmployeeRequestNormalizer normalizer;

    @Autowired
    public EmployeeController(EmployeeService service, EmployeeRequestNormalizer normalizer) {
        this.service = service;
        this.normalizer = normalizer;
    }

    // Thêm nhân viên mới
    @PostMapping
    @Operation(
            summary = "Add new employee",
            description = "Thêm nhân viên mới với đầy đủ thông tin"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Employee created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "409", description = "Email already exists")
    })
    public ResponseEntity<CreateEmployeeResponseDTO> addEmployee(
            @Valid @RequestBody AddEmployeeRequest request) {
        // Normalize request từ FE format → BE format
        // FE có thể gửi: name, gender_vi, contract Vietnamese...
        // Normalizer sẽ convert về: firstName/lastName, gender (male/female), contractType (English)
        normalizer.normalize(request);
        
        // Service chỉ nhận input đã normalize
        CreateEmployeeResponseDTO response = service.createEmployee(request);
        return ResponseEntity.status(201).body(response);
    }

    // Lấy danh sách tất cả nhân viên với filter và search
    @GetMapping
    @Operation(
            summary = "Get all employees list",
            description = "Lấy danh sách nhân viên với filter và search. Hỗ trợ: search (name/email), department, position, status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<EmployeeListResponse> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(service.getEmployeesWithFilters(search, department, position, status));
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

    // Lấy thống kê tổng số nhân viên và số nhân viên đang hoạt động
    @GetMapping("/stats")
    @Operation(
            summary = "Get employee statistics",
            description = "Lấy thống kê tổng số nhân viên và số nhân viên đang hoạt động (ACTIVE)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<EmployeeStatsDTO> getEmployeeStats() {
        EmployeeStatsDTO stats = service.getEmployeeStats();
        return ResponseEntity.ok(stats);
    }

    // Lấy thông tin nhân viên theo employeeId (String, ví dụ: EMP001)
    @GetMapping("/{id}")
    @Operation(summary = "Get employee by employeeId", description = "Get employee information by employeeId (String, e.g., EMP001)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeeDetailResponse> getEmployee(@PathVariable String id) {
        EmployeeDetailDTO detail = service.getEmployeeDetailById(id);
        EmployeeDetailResponse response = new EmployeeDetailResponse();
        response.setData(detail);
        response.setSuccess(true);
        return ResponseEntity.ok(response);
    }

    // Cập nhật thông tin nhân viên theo employeeId (String, ví dụ: EMP001)
    @PutMapping("/{id}")
    @Operation(summary = "Update employee", description = "Update employee information by employeeId (String, e.g., EMP001). Only updates fields provided in request, other fields remain unchanged.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "409", description = "Email already exists")
    })
    public ResponseEntity<UpdateEmployeeResponseDTO> updateEmployee(
            @PathVariable String id,
            @Valid @RequestBody UpdateEmployeeRequest request) {
        // Normalize request từ FE format → BE format
        normalizer.normalize(request);
        
        // Service chỉ nhận input đã normalize
        return ResponseEntity.ok(service.updateEmployeeById(id, request));
    }

    // Xóa nhân viên theo employeeId (String, ví dụ: EMP001)
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete employee",
            description = "Xóa nhân viên theo employeeId (String, e.g., EMP001)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Employee deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid employee ID")
    })
    public ResponseEntity<DeleteEmployeeResponseDTO> deleteEmployee(@PathVariable String id) {
        return ResponseEntity.ok(service.deleteEmployeeById(id));
    }

    // API cho Accountant: Tìm kiếm và lọc nhân viên với đầy đủ filter
    @GetMapping("/accountant/search")
    @Operation(
            summary = "Search employees for Accountant",
            description = "API dành cho Accountant để tìm kiếm và lọc nhân viên. Hỗ trợ: search (tên/email), department (phòng ban), position (chức vụ), minSalary (mức lương tối thiểu), maxSalary (mức lương tối đa)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    public ResponseEntity<EmployeeListResponse> searchEmployeesForAccountant(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(required = false) BigDecimal maxSalary) {
        EmployeeListResponse response = service.getEmployeesForAccountant(search, department, position, minSalary, maxSalary);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/seniority/{employeeID}")
    @Operation(summary = "Get seniority", description = "Tính thâm niêm của nhân viên")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid employee ID")
    })
    public ResponseEntity<SeniorityDTO> getSeniority(@PathVariable String employeeID) {
        SeniorityDTO result = service.seniority(employeeID);
        return ResponseEntity.ok(result);
    }
}

