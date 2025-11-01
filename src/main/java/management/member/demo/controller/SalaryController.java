package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.Service.SalaryService;
import management.member.demo.dto.SalaryRequest;
import management.member.demo.dto.SalaryResponse;
import management.member.demo.dto.SalarySummaryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/salary")
@Tag(name = "Salary", description = "Salary calculation and management endpoints")
public class SalaryController {

    private final SalaryService salaryService;

    @Autowired
    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping("/{employeeId}/latest")
    @Operation(
            summary = "Get latest salary", 
            description = "Calculate and get the latest salary for an employee (Lương tháng gần nhất)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid employee ID")
    })
    public ResponseEntity<Map<String, Object>> getLatestSalary(@PathVariable Long employeeId) {
        BigDecimal latestSalary = salaryService.calculateLatestSalary(employeeId);
        return ResponseEntity.ok(Map.of(
                "employeeId", employeeId,
                "latestSalary", latestSalary
        ));
    }

    @GetMapping("/{employeeId}/average")
    @Operation(
            summary = "Get average salary", 
            description = "Calculate and get the average salary for an employee (Lương trung bình)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid employee ID")
    })
    public ResponseEntity<Map<String, Object>> getAverageSalary(@PathVariable Long employeeId) {
        BigDecimal averageSalary = salaryService.calculateAverageSalary(employeeId);
        return ResponseEntity.ok(Map.of(
                "employeeId", employeeId,
                "averageSalary", averageSalary
        ));
    }

    @GetMapping("/{employeeId}/total-income")
    @Operation(
            summary = "Get total income", 
            description = "Calculate and get the total income for an employee (Tổng thu nhập)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid employee ID")
    })
    public ResponseEntity<Map<String, Object>> getTotalIncome(@PathVariable Long employeeId) {
        BigDecimal totalIncome = salaryService.calculateTotalIncome(employeeId);
        return ResponseEntity.ok(Map.of(
                "employeeId", employeeId,
                "totalIncome", totalIncome
        ));
    }

    @GetMapping("/{employeeId}/summary")
    @Operation(
            summary = "Get salary summary", 
            description = "Get salary summary including latest salary, average salary, and total income for an employee"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid employee ID")
    })
    public ResponseEntity<SalarySummaryResponse> getSalarySummary(@PathVariable Long employeeId) {
        return ResponseEntity.ok(salaryService.getSalarySummary(employeeId));
    }

    @GetMapping("/record/{id}")
    @Operation(
            summary = "Get salary record by id",
            description = "Get salary record information by id"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Salary record not found")
    })
    public ResponseEntity<SalaryResponse> getSalaryById(@PathVariable Long id) {
        return ResponseEntity.ok(salaryService.getSalaryById(id));
    }

    @PostMapping("/record")
    @Operation(
            summary = "Create salary record",
            description = "Create a new salary record. Net salary will be calculated automatically before saving to database"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Salary created successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<SalaryResponse> createSalary(@Valid @RequestBody SalaryRequest request) {
        SalaryResponse response = salaryService.createSalary(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/record/{id}")
    @Operation(
            summary = "Update salary record",
            description = "Update an existing salary record. Net salary will be recalculated automatically before saving to database"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Salary updated successfully"),
            @ApiResponse(responseCode = "404", description = "Salary or Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<SalaryResponse> updateSalary(
            @PathVariable Long id,
            @Valid @RequestBody SalaryRequest request) {
        return ResponseEntity.ok(salaryService.updateSalary(id, request));
    }
}

