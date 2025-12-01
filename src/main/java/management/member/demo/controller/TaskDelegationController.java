package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.service.TaskDelegationService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/task-delegation")
@Tag(name = "Task Delegation", description = "Task delegation management endpoints")
public class TaskDelegationController {

    @Autowired
    private TaskDelegationService delegationService;

    @PostMapping
    @Operation(summary = "Create delegation", description = "Create a new task delegation request")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Delegation created successfully")
    })
    public ResponseEntity<CreateDelegationResponseDTO> createDelegation(
            @Valid @RequestBody CreateDelegationRequestDTO request) {
        CreateDelegationResponseDTO response = delegationService.createDelegation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get delegations", description = "Get task delegations with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<DelegationListResponseDTO> getDelegations(
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String status) {
        DelegationListResponseDTO response = delegationService.getDelegations(employeeId, status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve delegation", description = "Approve a task delegation request")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Delegation approved successfully"),
            @ApiResponse(responseCode = "404", description = "Delegation not found")
    })
    public ResponseEntity<UpdateDelegationStatusResponseDTO> approveDelegation(@PathVariable String id) {
        UpdateDelegationStatusResponseDTO response = delegationService.approveDelegation(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject delegation", description = "Reject a task delegation request")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Delegation rejected"),
            @ApiResponse(responseCode = "404", description = "Delegation not found")
    })
    public ResponseEntity<UpdateDelegationStatusResponseDTO> rejectDelegation(
            @PathVariable String id,
            @RequestBody(required = false) RejectDelegationRequestDTO request) {
        UpdateDelegationStatusResponseDTO response = delegationService.rejectDelegation(id, request);
        return ResponseEntity.ok(response);
    }
}

