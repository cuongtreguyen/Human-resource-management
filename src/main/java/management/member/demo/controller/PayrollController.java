package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.service.PayrollService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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

    /**
     * Lấy bảng lương hàng tháng của nhân viên cho Accountant
     */
    @GetMapping("/accountant/monthly")
    @Operation(
            summary = "Get monthly payroll for Accountant",
            description = "Get monthly payroll records with employee details for Accountant. Optional month parameter (format: YYYY-MM, default: current month)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "400", description = "Invalid month format")
    })
    public ResponseEntity<List<MonthlyPayrollForAccountantDTO>> getMonthlyPayrollForAccountant(
            @RequestParam(required = false) String month) {
        List<MonthlyPayrollForAccountantDTO> result = service.getMonthlyPayrollForAccountant(month);
        return ResponseEntity.ok(result);
    }

    /**
     * Tính toán Payroll cho Accountant
     * Lấy thông tin tự động từ Employee và cho phép Accountant nhập allowance, deduction, bonus
     */
    @PostMapping("/accountant/calculate")
    @Operation(
            summary = "Calculate payroll for Accountant",
            description = "Calculate payroll with automatic data from Employee (baseSalary, otHours, dayOff, lateDay) and manual input (allowance, deduction, bonus)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payroll calculated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<PayrollCalculationForAccountantResponseDTO> calculatePayrollForAccountant(
            @Valid @RequestBody PayrollCalculationForAccountantRequestDTO request) {
        PayrollCalculationForAccountantResponseDTO response = service.calculatePayrollForAccountant(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin Payroll Calculation cho Accountant
     * Lấy từ Salary entity và tính toán các giá trị: BHXH, BHYT, BHTN, Thuế TNCN, totalDeductions, netSalary
     */
    @GetMapping("/accountant/calculation/{employeeId}")
    @Operation(
            summary = "Get payroll calculation for Accountant",
            description = "Get payroll calculation details for Accountant including all deductions (BHXH 8%, BHYT 1.5%, BHTN 1%), personal income tax, total deductions, and net salary"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee or Salary not found")
    })
    public ResponseEntity<GetPayrollCalculationForAccountantResponseDTO> getPayrollCalculationForAccountant(
            @PathVariable Long employeeId) {
        GetPayrollCalculationForAccountantResponseDTO response = service.getPayrollCalculationForAccountant(employeeId);
        return ResponseEntity.ok(response);
    }
}

