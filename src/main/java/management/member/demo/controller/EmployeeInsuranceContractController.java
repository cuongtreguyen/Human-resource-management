package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.dto.AddInsuranceContractForEmployeeRequestDTO;
import management.member.demo.dto.InsuranceContractByEmployeeResponseDTO;
import management.member.demo.dto.UpdateInsuranceContractByEmployeeRequestDTO;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeInsuranceContract;
import management.member.demo.mapper.EmployeeInsuranceContractMapper;
import management.member.demo.service.EmployeeInsuranceContractService;
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
@RequestMapping("/api/employee-insurance-contracts")
@Tag(name = "Employee Insurance Contracts", description = "Employee insurance contracts management endpoints")
public class EmployeeInsuranceContractController {

    private final EmployeeInsuranceContractService employeeInsuranceContractService;
    private final EmployeeInsuranceContractMapper employeeInsuranceContractMapper;

    @Autowired
    public EmployeeInsuranceContractController(
            EmployeeInsuranceContractService employeeInsuranceContractService,
            EmployeeInsuranceContractMapper employeeInsuranceContractMapper) {
        this.employeeInsuranceContractService = employeeInsuranceContractService;
        this.employeeInsuranceContractMapper = employeeInsuranceContractMapper;
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(
            summary = "Get all insurance contracts by employee ID",
            description = "Lấy tất cả hợp đồng bảo hiểm của nhân viên theo employeeId với employeeId, fullName, department, contractId, insurenceName, employerRate, employeeRate, grantDate"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<List<InsuranceContractByEmployeeResponseDTO>> getAllInsuranceContractsByEmployeeId(
            @PathVariable String employeeId) {
        // Lấy contracts từ service (trả về Entity)
        List<EmployeeInsuranceContract> contracts = 
                employeeInsuranceContractService.getAllInsuranceContractsByEmployeeId(employeeId);
        
        // Lấy employee để map fullName và department
        Employee employee = employeeInsuranceContractService.getEmployeeById(employeeId);
        final Employee finalEmployee = employee;
        final String finalEmployeeId = employeeId;
        
        // Map từ Entity sang DTO bằng mapper
        List<InsuranceContractByEmployeeResponseDTO> result = contracts.stream()
                .map(contract -> employeeInsuranceContractMapper.toResponseDTO(contract, finalEmployee, finalEmployeeId))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/employee/{employeeId}")
    @Operation(
            summary = "Add insurance contract for employee by employee ID",
            description = "Thêm hợp đồng bảo hiểm cho nhân viên theo employeeId với contractId, effective, expiry, grantDate"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Insurance contract added successfully"),
            @ApiResponse(responseCode = "404", description = "Employee or contract not found")
    })
    public ResponseEntity<InsuranceContractByEmployeeResponseDTO> addInsuranceContractForEmployeeById(
            @PathVariable String employeeId,
            @Valid @RequestBody AddInsuranceContractForEmployeeRequestDTO request) {
        // Lấy contract từ service (trả về Entity)
        EmployeeInsuranceContract contract = 
                employeeInsuranceContractService.addInsuranceContractForEmployeeById(employeeId, request);
        
        // Lấy employee để map fullName và department
        Employee employee = employeeInsuranceContractService.getEmployeeById(employeeId);
        
        // Map từ Entity sang DTO bằng mapper
        InsuranceContractByEmployeeResponseDTO dto = 
                employeeInsuranceContractMapper.toResponseDTO(contract, employee, employeeId);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/employee/{employeeId}/contract/{contractId}")
    @Operation(
            summary = "Update insurance contract by employee ID and contract ID",
            description = "Cập nhật hợp đồng bảo hiểm theo employeeId và contractId với contractId, effective, expiry, grantDate"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Insurance contract updated successfully"),
            @ApiResponse(responseCode = "404", description = "Employee or insurance contract not found")
    })
    public ResponseEntity<InsuranceContractByEmployeeResponseDTO> updateInsuranceContractByEmployeeId(
            @PathVariable String employeeId,
            @PathVariable Long contractId,
            @Valid @RequestBody UpdateInsuranceContractByEmployeeRequestDTO request) {
        // Lấy contract từ service (trả về Entity)
        EmployeeInsuranceContract contract = 
                employeeInsuranceContractService.updateInsuranceContractByEmployeeId(employeeId, contractId, request);
        
        // Lấy employee để map fullName và department
        Employee employee = employeeInsuranceContractService.getEmployeeById(employeeId);
        
        // Map từ Entity sang DTO bằng mapper
        InsuranceContractByEmployeeResponseDTO dto = 
                employeeInsuranceContractMapper.toResponseDTO(contract, employee, employeeId);
        
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/employee/{employeeId}/contract/{contractId}")
    @Operation(
            summary = "Delete insurance contract by employee ID and contract ID",
            description = "Xóa hợp đồng bảo hiểm theo employeeId và contractId"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Insurance contract deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Employee or insurance contract not found")
    })
    public ResponseEntity<Void> deleteInsuranceContractByEmployeeId(
            @PathVariable String employeeId,
            @PathVariable Long contractId) {
        employeeInsuranceContractService.deleteInsuranceContractByEmployeeId(employeeId, contractId);
        return ResponseEntity.ok().build();
    }
}

