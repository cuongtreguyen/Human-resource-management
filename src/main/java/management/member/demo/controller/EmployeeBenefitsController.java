package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.dto.AddBenefitForEmployeeRequestDTO;
import management.member.demo.dto.EmployeeBenefitResponseDTO;
import management.member.demo.dto.UpdateEmployeeBenefitRequestDTO;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.mapper.EmployeeBenefitsMapper;
import management.member.demo.service.EmployeeBenefitsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee-benefits")
@Tag(name = "Employee Benefits", description = "Employee benefits management endpoints")
public class EmployeeBenefitsController {

    private final EmployeeBenefitsService employeeBenefitsService;
    private final EmployeeBenefitsMapper employeeBenefitsMapper;

    @Autowired
    public EmployeeBenefitsController(
            EmployeeBenefitsService employeeBenefitsService,
            EmployeeBenefitsMapper employeeBenefitsMapper) {
        this.employeeBenefitsService = employeeBenefitsService;
        this.employeeBenefitsMapper = employeeBenefitsMapper;
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(
            summary = "Get all benefits by employee ID",
            description = "Lấy tất cả phúc lợi của nhân viên theo employeeId với employeeId, fullName, department, benefitId, benefitName, allowanceAmount, grantDate, status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<List<EmployeeBenefitResponseDTO>> getAllBenefitsByEmployeeId(
            @PathVariable String employeeId) {
        // Lấy benefits từ service (trả về Entity)
        List<EmployeeBenefits> benefits = 
                employeeBenefitsService.getAllBenefitsByEmployeeId(employeeId);
        
        // Lấy employee để map fullName và department
        Employee employee = employeeBenefitsService.getEmployeeById(employeeId);
        final Employee finalEmployee = employee;
        final String finalEmployeeId = employeeId;
        
        // Map từ Entity sang DTO bằng mapper
        List<EmployeeBenefitResponseDTO> result = benefits.stream()
                .map(benefit -> employeeBenefitsMapper.toResponseDTO(benefit, finalEmployee, finalEmployeeId))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/employee/{employeeId}")
    @Operation(
            summary = "Add benefit for employee by employee ID",
            description = "Thêm phúc lợi cho nhân viên theo employeeId với benefitId, grantDate, status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Benefit added successfully"),
            @ApiResponse(responseCode = "404", description = "Employee or benefit not found")
    })
    public ResponseEntity<EmployeeBenefitResponseDTO> addBenefitForEmployeeById(
            @PathVariable String employeeId,
            @Valid @RequestBody AddBenefitForEmployeeRequestDTO request) {
        // Lấy benefit từ service (trả về Entity)
        EmployeeBenefits benefit = 
                employeeBenefitsService.addBenefitForEmployeeById(employeeId, request);
        
        // Lấy employee để map fullName và department
        Employee employee = employeeBenefitsService.getEmployeeById(employeeId);
        
        // Map từ Entity sang DTO bằng mapper
        EmployeeBenefitResponseDTO dto = 
                employeeBenefitsMapper.toResponseDTO(benefit, employee, employeeId);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/employee/{employeeId}/benefit/{benefitId}")
    @Operation(
            summary = "Update benefit by employee ID and benefit ID",
            description = "Cập nhật phúc lợi theo employeeId và benefitId với benefitId, grantDate, status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Benefit updated successfully"),
            @ApiResponse(responseCode = "404", description = "Employee or benefit not found")
    })
    public ResponseEntity<EmployeeBenefitResponseDTO> updateBenefitByEmployeeId(
            @PathVariable String employeeId,
            @PathVariable String benefitId,
            @Valid @RequestBody UpdateEmployeeBenefitRequestDTO request) {
        // Lấy benefit từ service (trả về Entity)
        EmployeeBenefits benefit = 
                employeeBenefitsService.updateBenefitByEmployeeId(employeeId, benefitId, request);
        
        // Lấy employee để map fullName và department
        Employee employee = employeeBenefitsService.getEmployeeById(employeeId);
        
        // Map từ Entity sang DTO bằng mapper
        EmployeeBenefitResponseDTO dto = 
                employeeBenefitsMapper.toResponseDTO(benefit, employee, employeeId);
        
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/employee/{employeeId}/benefit/{benefitId}")
    @Operation(
            summary = "Delete benefit by employee ID and benefit ID",
            description = "Xóa phúc lợi theo employeeId và benefitId"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Benefit deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Employee or benefit not found")
    })
    public ResponseEntity<Void> deleteBenefitByEmployeeId(
            @PathVariable String employeeId,
            @PathVariable String benefitId) {
        employeeBenefitsService.deleteBenefitByEmployeeId(employeeId, benefitId);
        return ResponseEntity.ok().build();
    }
}
