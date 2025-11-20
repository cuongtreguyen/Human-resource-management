package management.member.demo.controller;

import management.member.demo.Service.EmployeeInsuranceContractService;
import management.member.demo.dto.EmployeeInsuranceContractResponse;
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
@RequestMapping("/employee-insurance-contracts")
@Tag(name = "Employee Insurance Contracts", description = "Employee insurance contracts management endpoints")
public class EmployeeInsuranceContractController {

    private final EmployeeInsuranceContractService employeeInsuranceContractService;

    @Autowired
    public EmployeeInsuranceContractController(EmployeeInsuranceContractService employeeInsuranceContractService) {
        this.employeeInsuranceContractService = employeeInsuranceContractService;
    }

    // Lấy tất cả danh sách hợp đồng bảo hiểm nhân viên
    @GetMapping
    @Operation(
            summary = "Get all employee insurance contracts",
            description = "Lấy tất cả danh sách hợp đồng bảo hiểm nhân viên"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "No insurance contracts found")
    })
    public ResponseEntity<List<EmployeeInsuranceContractResponse>> getAllEmployeeInsuranceContracts() {
        return ResponseEntity.ok(employeeInsuranceContractService.GetAllEmployeeInsuranceContracts());
    }

    // Đếm tổng số lượng hợp đồng bảo hiểm của nhân viên theo ID
    @GetMapping("/{employeeId}/total")
    @Operation(
            summary = "Get total insurance contracts count by employee ID",
            description = "Đếm tổng số lượng hợp đồng bảo hiểm của nhân viên theo ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid employee ID")
    })
    public ResponseEntity<Map<String, Object>> getTotalInsuranceContracts(@PathVariable Long employeeId) {
        Long total = employeeInsuranceContractService.getTotalInsuranceContracts(employeeId);
        return ResponseEntity.ok(Map.of(
                "employeeId", employeeId,
                "totalInsuranceContracts", total
        ));
    }
}

