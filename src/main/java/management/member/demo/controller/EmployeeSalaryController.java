package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import management.member.demo.dto.SalarySummaryResponse;
import management.member.demo.entity.Employee;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.service.SalaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/employee/salary")
@Tag(name = "Employee Salary", description = "Employee salary information endpoints - Accessible by all roles")
public class EmployeeSalaryController {

    private final SalaryService salaryService;
    private final EmployeeRepository employeeRepository;

    public EmployeeSalaryController(SalaryService salaryService, EmployeeRepository employeeRepository) {
        this.salaryService = salaryService;
        this.employeeRepository = employeeRepository;
    }

    private Long getCurrentEmployeeId(Authentication authentication) {
        String email = authentication.getName();
        return employeeRepository.findByEmail(email)
                .map(Employee::getId)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy nhân viên với email: " + email));
    }

    @GetMapping("/api/my-latest")
    @Operation(summary = "Get my latest salary")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Map<String, Object>> getMyLatestSalary(Authentication authentication) {
        Long employeeId = getCurrentEmployeeId(authentication);
        BigDecimal latest = salaryService.getMyLatestSalary(employeeId);  // ĐÃ SỬA
        return ResponseEntity.ok(Map.of("employeeId", employeeId, "latestSalary", latest));
    }

    @GetMapping("/api/my-average")
    @Operation(summary = "Get my average salary")
    public ResponseEntity<Map<String, Object>> getMyAverageSalary(Authentication authentication) {
        Long employeeId = getCurrentEmployeeId(authentication);
        BigDecimal average = salaryService.getMyAverageSalary(employeeId);  // ĐÃ SỬA
        return ResponseEntity.ok(Map.of("employeeId", employeeId, "averageSalary", average));
    }

    @GetMapping("/api/my-total-income")
    @Operation(summary = "Get my total income")
    public ResponseEntity<Map<String, Object>> getMyTotalIncome(Authentication authentication) {
        Long employeeId = getCurrentEmployeeId(authentication);
        BigDecimal total = salaryService.getMyTotalIncome(employeeId);  // ĐÃ SỬA
        return ResponseEntity.ok(Map.of("employeeId", employeeId, "totalIncome", total));
    }

    @GetMapping("/api/my-summary")
    @Operation(summary = "Get my salary summary")
    public ResponseEntity<SalarySummaryResponse> getMySalarySummary(Authentication authentication) {
        Long employeeId = getCurrentEmployeeId(authentication);
        return ResponseEntity.ok(salaryService.getMySalarySummary(employeeId));  // ĐÃ SỬA
    }
}