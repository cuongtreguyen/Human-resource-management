package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.service.OnLeaveService;
import management.member.demo.dto.*;
import management.member.demo.normalizer.LeaveRequestNormalizer;
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
    private final LeaveRequestNormalizer normalizer;

    // New endpoints according to API spec
    @GetMapping
    @Operation(summary = "Get all leave requests", description = "Get leave requests with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<LeaveListResponseDTO> getAllLeaveRequests(
            @RequestParam(required = false) OnLeaveStatus status,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        LeaveListResponseDTO response = service.getAllLeaveRequests(status, employeeId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo yêu cầu nghỉ phép mới dành cho manager", description = "Create a new leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Leave request created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<CreateLeaveResponseDTO> createLeaveRequestForManager(
            @Valid @RequestBody CreateLeaveRequestDTO request) {
        // Normalize request từ FE format → BE format
        // FE có thể gửi: tasks (objects) → normalizer sẽ extract task IDs
        normalizer.normalize(request);
        
        // Service chỉ nhận input đã normalize
        CreateLeaveResponseDTO response = service.createLeaveRequestForManager(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // tạo đơn xin nghỉ phép cho nhân viên bình thường
    @PostMapping("/createForEmployee")
    @Operation(summary = "Create leave request", description = "Create a new leave request")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Leave request created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<CreateLeaveResponseDTO> createLeaveRequest(
            @Valid @RequestBody CreateLeaveRequestDTO request) {
        // Normalize request từ FE format → BE format
        // FE có thể gửi: tasks (objects) → normalizer sẽ extract task IDs
        normalizer.normalize(request);

        // Service chỉ nhận input đã normalize
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

//
//@GetMapping("/history/{employeeId}")
//    @Operation(summary = "Get leave history", description = "Get leave history for an employee")
//    @ApiResponses({
//            @ApiResponse(responseCode = "200", description = "Success"),
//            @ApiResponse(responseCode = "404", description = "Employee not found")
//    })
//    public ResponseEntity<LeaveHistoryResponseDTO> getLeaveHistory(@PathVariable String employeeId) {
//        LeaveHistoryResponseDTO response = service.getLeaveHistory(employeeId);
//        return ResponseEntity.ok(response);
//    }
    @GetMapping("/getLeaveListByID/{id}")
    @Operation(summary = "Lấy danh sách đơn xin nghỉ theo ID", description = "Get leave requests for an employee by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<List<OnLeaveListResponse>> getLeaveListByID(@PathVariable Long id) {
        return ResponseEntity.ok(service.getLeaveListByID(id));
    }

    @GetMapping("/countLeaveReqByID/{id}")
    @Operation(summary = "Đếm số đơn chờ duyệt theo ID", description = "Count pending leave requests for an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<Long> countLeaveReqByID(@PathVariable Long id) {
        return ResponseEntity.ok(service.countPendingOnLeaveRequestsById(id));
    }

    @GetMapping("/countLeaveReq")
    @Operation(summary = "Đếm tất cả đơn xin nghỉ chờ duyệt", description = "Count leave requests pending")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<Long> countAllPendingOnLeaveRequests() {
        return ResponseEntity.ok(service.countAllPendingOnLeaveRequests());
    }

    @GetMapping("/onLeaveRequestWaiting/{id}")
    @Operation(summary = "Đếm tất cả loại đơn theo ID", description = "Count pending leave requests for an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<LeaveSummaryDTO> getLeaveSummary(@PathVariable Long id) {
        LeaveSummaryDTO summary = service.getLeaveSummary(id);
        return ResponseEntity.ok(summary);
    }

    @PutMapping("/updateStatus/{leaveId}")
    public ResponseEntity<OnLeaveResponse> updateOnLeaveStatus(
            @PathVariable Long leaveId,
            @RequestParam("status") OnLeaveStatus status) {
        OnLeaveResponse response = service.updateOnLeaveStatus(leaveId, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/leave-statistics") // Đổi tên endpoint cho đúng ý nghĩa
    @Operation(summary = "Thống kê số lượng đơn xin nghỉ theo từng trạng thái",
            description = "Trả về Map chứa: TOTAL, PENDING, APPROVED, REJECTED...")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<Map<String, Long>> getLeaveStatistics() {
        // Gọi hàm service vừa viết ở bước trước
        return ResponseEntity.ok(service.countLeaveReq());
    }

    @GetMapping("/getAllLeaveByEmployeeId/{employeeId}")
    public ResponseEntity<List<OnLeaveListResponse>> getAllLeaveReqByEmployeeId(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(service.getAllLeaveByEmployeeId(employeeId));
    }




    @GetMapping("/getLeaveReqByID/{id}")
    @Operation(summary = "Lấy đơn xin nghỉ theo ID đơn", description = "Get leave requests for an employee by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<OnLeaveResponse> getLeaveReqByID(@PathVariable String id) {
        return ResponseEntity.ok(service.getLeaveReqByID(id));
    }

    @PutMapping("/setLeaveStatus/{leaveId}")
    @Operation(summary = "Duyệt hoặc Từ chối đơn nghỉ phép", description = "Update leave status (APPROVED, REJECTED...)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Leave request not found")
    })
    public ResponseEntity<OnLeaveResponse> setLeaveStatus(
            @PathVariable String leaveId,
            @RequestParam("status") OnLeaveStatus status) {
        service.setLeaveStatusByID(leaveId, status);
        OnLeaveResponse updatedResponse = service.getLeaveReqByID(leaveId);

        return ResponseEntity.ok(updatedResponse);
    }

    /**
     * Lấy danh sách đơn xin nghỉ phép cho Accountant theo ID nhân viên
     */
    @GetMapping("/accountant/applications")
    @Operation(
            summary = "Get list of leave applications for Accountant by employee ID",
            description = "Get leave applications with employee details for Accountant filtered by employee ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "400", description = "Employee ID is required"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<List<LeaveApplicationForAccountantDTO>> getLeaveApplicationsForAccountant(
            @RequestParam Long employeeId) {
        List<LeaveApplicationForAccountantDTO> result = service.getLeaveApplicationsForAccountant(employeeId);
        return ResponseEntity.ok(result);
    }

    /**
     * Lấy chi tiết đơn xin nghỉ phép cho Accountant
     */
    @GetMapping("/accountant/applications/{leaveId}")
    @Operation(
            summary = "Get leave application details for Accountant",
            description = "Get detailed information of a specific leave application for Accountant"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Leave application not found")
    })
    public ResponseEntity<LeaveApplicationDetailForAccountantDTO> getLeaveApplicationDetailForAccountant(
            @PathVariable Long leaveId) {
        LeaveApplicationDetailForAccountantDTO result = service.getLeaveApplicationDetailForAccountant(leaveId);
        return ResponseEntity.ok(result);
    }

}
