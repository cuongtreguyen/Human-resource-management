package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.Service.PayrollService;
import management.member.demo.dto.PayrollRequest;
import management.member.demo.dto.PayrollResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/payrolls")
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
}

