package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.service.AuditLogService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@Tag(name = "Audit Logs", description = "Audit logs management endpoints")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    @Operation(summary = "Get all logs", description = "Get audit logs with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<List<AuditLogDTO>> getAllLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String date) {
        List<AuditLogDTO> logs = auditLogService.getAllLogs(search, type, date);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/paginated")
    @Operation(summary = "Get paginated logs", description = "Get audit logs with pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<PaginatedLogsResponseDTO> getPaginatedLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String date,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {
        PaginatedLogsResponseDTO response = auditLogService.getPaginatedLogs(search, type, date, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get log statistics", description = "Get audit log statistics by action type")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<AuditLogStatsDTO> getLogStatistics(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String date) {
        AuditLogStatsDTO stats = auditLogService.getLogStatistics(search, type, date);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get logs by employee", description = "Get audit logs for a specific employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<List<AuditLogDTO>> getLogsByEmployee(@PathVariable String employeeId) {
        List<AuditLogDTO> logs = auditLogService.getLogsByEmployee(employeeId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping
    @Operation(summary = "Create log", description = "Create a new audit log entry")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Log created successfully")
    })
    public ResponseEntity<CreateAuditLogResponseDTO> createLog(
            @Valid @RequestBody CreateAuditLogRequestDTO request) {
        CreateAuditLogResponseDTO response = auditLogService.createLog(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/initialize")
    @Operation(summary = "Initialize sample logs", description = "Create sample audit logs for testing")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sample logs initialized")
    })
    public ResponseEntity<InitializeLogsResponseDTO> initializeSampleLogs() {
        InitializeLogsResponseDTO response = auditLogService.initializeSampleLogs();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cleanup")
    @Operation(summary = "Clean old logs", description = "Delete audit logs older than specified days")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Logs cleaned successfully")
    })
    public ResponseEntity<CleanupLogsResponseDTO> cleanupOldLogs(
            @RequestParam(required = false, defaultValue = "30") Integer daysToKeep) {
        CleanupLogsResponseDTO response = auditLogService.cleanupOldLogs(daysToKeep);
        return ResponseEntity.ok(response);
    }
}

