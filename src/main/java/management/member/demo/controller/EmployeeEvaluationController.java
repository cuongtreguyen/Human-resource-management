package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.service.EmployeeEvaluationService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evaluations")
@Tag(name = "Employee Evaluation", description = "Employee evaluation management endpoints")
public class EmployeeEvaluationController {

    @Autowired
    private EmployeeEvaluationService evaluationService;

    @GetMapping
    @Operation(summary = "Get all evaluations", description = "Get all evaluations with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<EvaluationListResponseDTO> getAllEvaluations(
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String period) {
        EvaluationListResponseDTO response = evaluationService.getAllEvaluations(employeeId, period);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get employee evaluations", description = "Get evaluations for a specific employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EvaluationListResponseDTO> getEmployeeEvaluations(@PathVariable String employeeId) {
        EvaluationListResponseDTO response = evaluationService.getEmployeeEvaluations(employeeId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create evaluation", description = "Create a new employee evaluation")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Evaluation created successfully")
    })
    public ResponseEntity<CreateEvaluationResponseDTO> createEvaluation(
            @Valid @RequestBody CreateEvaluationRequestDTO request) {
        CreateEvaluationResponseDTO response = evaluationService.createEvaluation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update evaluation", description = "Update an existing evaluation")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Evaluation updated successfully"),
            @ApiResponse(responseCode = "404", description = "Evaluation not found")
    })
    public ResponseEntity<UpdateEvaluationResponseDTO> updateEvaluation(
            @PathVariable String id,
            @Valid @RequestBody CreateEvaluationRequestDTO request) {
        UpdateEvaluationResponseDTO response = evaluationService.updateEvaluation(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete evaluation", description = "Delete an evaluation")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Evaluation deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Evaluation not found")
    })
    public ResponseEntity<DeleteEvaluationResponseDTO> deleteEvaluation(@PathVariable String id) {
        DeleteEvaluationResponseDTO response = evaluationService.deleteEvaluation(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employees")
    @Operation(summary = "Get employees with evaluations", description = "Get list of employees with their evaluation information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<EmployeeWithEvaluationsListResponseDTO> getEmployeesWithEvaluations() {
        EmployeeWithEvaluationsListResponseDTO response = evaluationService.getEmployeesWithEvaluations();
        return ResponseEntity.ok(response);
    }
}

