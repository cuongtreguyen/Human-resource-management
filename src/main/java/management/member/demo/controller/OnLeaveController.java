package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.Enum.OnLeaveStatus;
import management.member.demo.Service.OnLeaveService;
import management.member.demo.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class OnLeaveController {

    private final OnLeaveService service;

    // New endpoints according to API spec
    @GetMapping
    @Operation(summary = "Get all leave requests", description = "Get leave requests with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<LeaveListResponseDTO> getAllLeaveRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        LeaveListResponseDTO response = service.getAllLeaveRequests(status, employeeId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create leave request", description = "Create a new leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Leave request created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<CreateLeaveResponseDTO> createLeaveRequest(
            @Valid @RequestBody CreateLeaveRequestDTO request) {
        CreateLeaveResponseDTO response = service.createLeaveRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update leave request status", description = "Update leave request status (approved|rejected)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Leave request not found")
    })
    public ResponseEntity<UpdateLeaveStatusResponseDTO> updateLeaveStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateLeaveStatusRequestDTO request) {
        UpdateLeaveStatusResponseDTO response = service.updateLeaveStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel leave request", description = "Cancel a leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Leave request cancelled successfully"),
            @ApiResponse(responseCode = "404", description = "Leave request not found")
    })
    public ResponseEntity<UpdateLeaveStatusResponseDTO> cancelLeaveRequest(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> request) {
        String reason = request != null ? request.get("reason") : null;
        UpdateLeaveStatusResponseDTO response = service.cancelLeaveRequest(id, reason);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/balance/{employeeId}")
    @Operation(summary = "Get leave balance", description = "Get leave balance for an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<LeaveBalanceResponseDTO> getLeaveBalance(@PathVariable String employeeId) {
        LeaveBalanceResponseDTO response = service.getLeaveBalance(employeeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{employeeId}")
    @Operation(summary = "Get leave history", description = "Get leave history for an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<LeaveHistoryResponseDTO> getLeaveHistory(
            @PathVariable String employeeId,
            @RequestParam(required = false) Integer year) {
        LeaveHistoryResponseDTO response = service.getLeaveHistory(employeeId, year);
        return ResponseEntity.ok(response);
    }

    // Keep old endpoints for backward compatibility
    @PostMapping("/create")
    public ResponseEntity<OnLeaveResponse> createOnLeave(@Valid @RequestBody OnLeaveRequest request) {
        return ResponseEntity.ok(service.createOnLeave(request));
    }

    @GetMapping("/getLeaveListByID/{id}")
    public ResponseEntity<List<OnLeaveListResponse>> getLeaveListByID(@PathVariable Long id) {
        return ResponseEntity.ok(service.getLeaveListByID(id));
    }

    @GetMapping("/countLeaveReqByID/{id}")
    public ResponseEntity<Long> countLeaveReqByID(@PathVariable Long id) {
        return ResponseEntity.ok(service.countPendingOnLeaveRequestsById(id));
    }

    @GetMapping("/onLeaveRequestWaiting/{id}")
    public ResponseEntity<Map<String, Long>> getLeaveSummary(@PathVariable Long id) {
        Map<String, Long> summary = service.getLeaveSummary(id);
        return ResponseEntity.ok(summary);
    }

    @PutMapping("/updateStatus/{leaveId}")
    public ResponseEntity<OnLeaveResponse> updateOnLeaveStatus(
            @PathVariable Long leaveId,
            @RequestParam("status") OnLeaveStatus status) {
        OnLeaveResponse response = service.updateOnLeaveStatus(leaveId, status);
        return ResponseEntity.ok(response);
    }
}
