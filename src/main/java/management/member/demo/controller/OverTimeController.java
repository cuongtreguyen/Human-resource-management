package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.OvertimeDetailResponse;
import management.member.demo.dto.OvertimeRequest;
import management.member.demo.dto.OvertimeResponse;
import management.member.demo.enums.OverTimeStatus;
import management.member.demo.service.OvertimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/overtimes")
@RequiredArgsConstructor
public class OverTimeController {

    private final OvertimeService overtimeService;

    @PostMapping("/create")
    @Operation(summary = "Create overtime request", description = "Create a new overtime request")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Overtime request created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<OvertimeResponse> createOvertime(@RequestBody OvertimeRequest request) {
        OvertimeResponse response = overtimeService.createOvertime(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("countOvertimeByStatus/{status}")
    @Operation(summary = "Count overtime by status", description = "Count the number of overtime requests by their status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status value")
    })
    public ResponseEntity<Long> countOvertimeByStatus(@RequestParam(required = false) OverTimeStatus status) {
        Long count = overtimeService.countOvertimeByStatus(status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/countAllOTTime")
    @Operation(summary = "Count all overtime hours", description = "Calculate the total number of overtime hours")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Total overtime hours retrieved successfully")
    })
    public ResponseEntity<Double> countAllOTTime() {
        Double totalHours = overtimeService.countAllOTTime();
        return ResponseEntity.ok(totalHours);
    }

    @GetMapping("/getOvertimeByStatus")
    @Operation(summary = "Get overtime by status", description = "Retrieve overtime requests by their status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Overtime requests retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status value")
    })
    public ResponseEntity<?> getOvertimeByStatus(@RequestParam(required = false) OverTimeStatus status) {
        return ResponseEntity.ok(overtimeService.getOvertimeByStatus(status));
    }

    @GetMapping("/getOvertimeByTitleOrEmpName")
    @Operation(summary = "Get overtime by title or employee name", description = "Retrieve overtime requests by their title or employee name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Overtime requests retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid keyword")
    })
    public ResponseEntity<?> getOvertimeByTitleOrEmpName(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(overtimeService.getOvertimeByTitleOrEmpName(keyword));
    }

    @PutMapping("/setOvertimeStatus/{id}")
    @Operation(summary = "Set overtime status", description = "Set the status of an overtime request")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Overtime status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<OvertimeResponse> setOvertimeStatus(@PathVariable Long id,
                                                              @RequestParam OverTimeStatus status,
                                                              @RequestParam(required = false) String managerNote) {
        OvertimeResponse response = overtimeService.setOvertimeStatus(id, status, managerNote);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getOvertimeDetails/{id}")
    @Operation(summary = "Get overtime details", description = "Retrieve details of a specific overtime request by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Overtime details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Overtime request not found")
    })
    public ResponseEntity<OvertimeDetailResponse> getOvertimeDetails(@PathVariable Long id) {
        OvertimeDetailResponse response = overtimeService.getDetailOTByID(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/employee/{employeeId}")
    @Operation(summary = "Get overtime history by employee ID", description = "Lấy lịch sử overtime của nhân viên theo employee ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Overtime history retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<?> getOvertimeHistoryByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(overtimeService.getOvertimeHistoryByEmployeeId(employeeId));
    }

    @GetMapping("/history/my-history")
    @Operation(summary = "Get my overtime history", description = "Lấy lịch sử overtime của nhân viên hiện tại")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Overtime history retrieved successfully")
    })
    public ResponseEntity<?> getMyOvertimeHistory() {
        return ResponseEntity.ok(overtimeService.getMyOvertimeHistory());
    }
}
