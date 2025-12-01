package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.service.PayrollService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import management.member.demo.dto.ExportResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/payroll")
@Tag(name = "Payroll", description = "Payroll management endpoints")
public class PayrollController {

    private final PayrollService service;

    @Autowired
    public PayrollController(PayrollService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payroll by id", description = "Get payroll information by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Payroll not found")
    })
    public ResponseEntity<PayrollResponse> getPayroll(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPayrollById(id));
    }

    @PostMapping
    @Operation(summary = "Create payroll", description = "Create a new payroll")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Payroll created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "409", description = "Payroll code already exists")
    })
    public ResponseEntity<PayrollResponse> createPayroll(@Valid @RequestBody PayrollRequest request) {
        PayrollResponse response = service.createPayroll(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update payroll", description = "Update payroll information by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Updated successfully"),
            @ApiResponse(responseCode = "404", description = "Payroll not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "409", description = "Payroll code already exists")
    })
    public ResponseEntity<PayrollResponse> updatePayroll(
            @PathVariable Long id,
            @Valid @RequestBody PayrollRequest request) {
        return ResponseEntity.ok(service.updatePayroll(id, request));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve payroll", description = "Approve a payroll and set all salaries to AWAITING status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payroll approved successfully"),
            @ApiResponse(responseCode = "404", description = "Payroll not found"),
            @ApiResponse(responseCode = "400", description = "Cannot approve payroll with current status")
    })
    public ResponseEntity<Void> approvePayroll(@PathVariable Long id) {
        service.approvePayroll(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/pay")
    @Operation(summary = "Pay payroll", description = "Mark payroll as paid and set all salaries to SUCCESS status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payroll paid successfully"),
            @ApiResponse(responseCode = "404", description = "Payroll not found")
    })
    public ResponseEntity<Void> payPayroll(@PathVariable Long id) {
        service.payPayroll(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/fail")
    @Operation(summary = "Fail payroll payment", description = "Mark payroll payment as failed and set all salaries to FAILED status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payroll marked as failed successfully"),
            @ApiResponse(responseCode = "404", description = "Payroll not found")
    })
    public ResponseEntity<Void> failPayroll(@PathVariable Long id) {
        service.failPayroll(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel payroll", description = "Cancel a payroll and set all salaries to CANCELLED status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payroll cancelled successfully"),
            @ApiResponse(responseCode = "404", description = "Payroll not found"),
            @ApiResponse(responseCode = "400", description = "Cannot cancel payroll that is already paid")
    })
    public ResponseEntity<Void> cancelPayroll(@PathVariable Long id) {
        service.cancelPayroll(id);
        return ResponseEntity.ok().build();
    }

    // New endpoints according to API spec
    @GetMapping
    @Operation(summary = "Get all payroll records", description = "Get payroll records with optional filters: month, employeeId, status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<PayrollListResponseDTO> getAllPayrollRecords(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String status) {
        PayrollListResponseDTO response = service.getAllPayrollRecords(month, employeeId, status);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/calculate")
    @Operation(summary = "Calculate payroll", description = "Calculate and create a payroll record for an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payroll calculated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<CalculatePayrollResponseDTO> calculatePayroll(
            @Valid @RequestBody CalculatePayrollRequestDTO request) {
        CalculatePayrollResponseDTO response = service.calculatePayroll(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update payroll status", description = "Update payroll status (paid|pending)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Payroll not found")
    })
    public ResponseEntity<UpdatePayrollStatusResponseDTO> updatePayrollStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        UpdatePayrollStatusResponseDTO response = service.updatePayrollStatusById(id, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export")
    @Operation(summary = "Export payroll", description = "Export payroll records to file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export completed successfully")
    })
    public ResponseEntity<ExportResponseDTO> exportPayroll(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String year,
            @RequestParam(required = false, defaultValue = "excel") String format) {
        ExportResponseDTO response = service.exportPayroll(month, year, format);
        return ResponseEntity.ok(response);
    }
}

