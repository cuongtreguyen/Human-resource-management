package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.dto.CreateInsuranceContractRequestDTO;
import management.member.demo.dto.InsuranceContractResponseDTO;
import management.member.demo.dto.UpdateInsuranceContractRequestDTO;
import management.member.demo.service.InsuranceContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/insurance-contracts")
@Tag(name = "Insurance Contracts", description = "Insurance contracts (template) management endpoints")
public class InsuranceContractController {

    private final InsuranceContractService insuranceContractService;

    @Autowired
    public InsuranceContractController(InsuranceContractService insuranceContractService) {
        this.insuranceContractService = insuranceContractService;
    }

    @GetMapping("/all")
    @Operation(
            summary = "Get all insurance contracts",
            description = "Lấy tất cả danh sách hợp đồng bảo hiểm template với id, insurenceName, employerRate, employeeRate, provider, effective, expiry, status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "No insurance contracts found")
    })
    public ResponseEntity<List<InsuranceContractResponseDTO>> getAllInsuranceContracts() {
        List<InsuranceContractResponseDTO> result = insuranceContractService.getAllInsuranceContracts();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/create")
    @Operation(
            summary = "Create new insurance contract",
            description = "Tạo hợp đồng bảo hiểm template mới với insurenceName, employerRate, employeeRate, provider, effective, expiry, status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Insurance contract created successfully")
    })
    public ResponseEntity<InsuranceContractResponseDTO> createInsuranceContract(
            @Valid @RequestBody CreateInsuranceContractRequestDTO request) {
        InsuranceContractResponseDTO result = insuranceContractService.createInsuranceContract(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{insurenceName}")
    @Operation(
            summary = "Update insurance contract by insurence name",
            description = "Cập nhật hợp đồng bảo hiểm template theo insurenceName với insurenceName, employerRate, employeeRate, provider, effective, expiry, status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Insurance contract updated successfully"),
            @ApiResponse(responseCode = "404", description = "Insurance contract not found")
    })
    public ResponseEntity<InsuranceContractResponseDTO> updateInsuranceContract(
            @PathVariable String insurenceName,
            @Valid @RequestBody UpdateInsuranceContractRequestDTO request) {
        InsuranceContractResponseDTO result = insuranceContractService.updateInsuranceContract(insurenceName, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{insurenceName}")
    @Operation(
            summary = "Delete insurance contract by insurence name",
            description = "Xóa hợp đồng bảo hiểm template theo insurenceName"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Insurance contract deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Insurance contract not found")
    })
    public ResponseEntity<Void> deleteInsuranceContract(@PathVariable String insurenceName) {
        insuranceContractService.deleteInsuranceContract(insurenceName);
        return ResponseEntity.ok().build();
    }
}

