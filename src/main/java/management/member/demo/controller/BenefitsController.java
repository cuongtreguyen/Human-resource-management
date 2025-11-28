package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.Service.BenefitsService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/benefits")
@Tag(name = "Benefits & Insurance", description = "Benefits and insurance management endpoints")
public class BenefitsController {

    @Autowired
    private BenefitsService benefitsService;

    @GetMapping
    @Operation(summary = "Get all benefits", description = "Get list of all available benefits")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<BenefitListResponseDTO> getBenefits() {
        BenefitListResponseDTO response = benefitsService.getBenefits();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get employee benefits", description = "Get benefits for a specific employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeeBenefitsDetailResponseDTO> getEmployeeBenefits(@PathVariable String employeeId) {
        EmployeeBenefitsDetailResponseDTO response = benefitsService.getEmployeeBenefits(employeeId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/requests")
    @Operation(summary = "Create benefit request", description = "Create a new benefit request")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Request created successfully")
    })
    public ResponseEntity<CreateBenefitRequestResponseDTO> createBenefitRequest(
            @Valid @RequestBody CreateBenefitRequestRequestDTO request) {
        CreateBenefitRequestResponseDTO response = benefitsService.createBenefitRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/requests/{id}/approve")
    @Operation(summary = "Approve benefit request", description = "Approve a benefit request")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Request approved successfully"),
            @ApiResponse(responseCode = "404", description = "Request not found")
    })
    public ResponseEntity<ApproveBenefitRequestResponseDTO> approveBenefitRequest(
            @PathVariable String id,
            @Valid @RequestBody ApproveBenefitRequestRequestDTO request) {
        ApproveBenefitRequestResponseDTO response = benefitsService.approveBenefitRequest(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/welfare-programs")
    @Operation(summary = "Get welfare programs", description = "Get list of welfare programs")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<WelfareProgramListResponseDTO> getWelfarePrograms() {
        WelfareProgramListResponseDTO response = benefitsService.getWelfarePrograms();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/insurance-policies")
    @Operation(summary = "Get insurance policies", description = "Get list of insurance policies")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<InsurancePolicyListResponseDTO> getInsurancePolicies() {
        InsurancePolicyListResponseDTO response = benefitsService.getInsurancePolicies();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/voluntary-insurance")
    @Operation(summary = "Get voluntary insurance", description = "Get list of voluntary insurance options")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<VoluntaryInsuranceListResponseDTO> getVoluntaryInsurance() {
        VoluntaryInsuranceListResponseDTO response = benefitsService.getVoluntaryInsurance();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}/insurance-detail")
    @Operation(summary = "Get employee insurance detail", description = "Get detailed insurance information for an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeeInsuranceDetailResponseDTO> getEmployeeInsuranceDetail(@PathVariable String employeeId) {
        EmployeeInsuranceDetailResponseDTO response = benefitsService.getEmployeeInsuranceDetail(employeeId);
        return ResponseEntity.ok(response);
    }
}

