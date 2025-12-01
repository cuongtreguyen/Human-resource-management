package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.service.RecruitmentService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruitment")
@Tag(name = "Recruitment", description = "Recruitment management endpoints")
public class RecruitmentController {

    @Autowired
    private RecruitmentService recruitmentService;

    @GetMapping("/positions")
    @Operation(summary = "Get recruitment positions", description = "Get recruitment positions with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<PositionListResponseDTO> getPositions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department) {
        PositionListResponseDTO response = recruitmentService.getPositions(status, department);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/positions")
    @Operation(summary = "Create position", description = "Create a new recruitment position")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Position created successfully")
    })
    public ResponseEntity<CreatePositionResponseDTO> createPosition(
            @Valid @RequestBody CreatePositionRequestDTO request) {
        CreatePositionResponseDTO response = recruitmentService.createPosition(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/applications")
    @Operation(summary = "Get applications", description = "Get recruitment applications with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ApplicationListResponseDTO> getApplications(
            @RequestParam(required = false) String positionId,
            @RequestParam(required = false) String status) {
        ApplicationListResponseDTO response = recruitmentService.getApplications(positionId, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/applications/{id}")
    @Operation(summary = "Get application by ID", description = "Get detailed application information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    public ResponseEntity<ApplicationDetailDTO> getApplicationById(@PathVariable String id) {
        ApplicationDetailDTO response = recruitmentService.getApplicationById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/applications/{id}/status")
    @Operation(summary = "Update application status", description = "Update application status")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    public ResponseEntity<UpdateApplicationStatusResponseDTO> updateApplicationStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateApplicationStatusRequestDTO request) {
        UpdateApplicationStatusResponseDTO response = recruitmentService.updateApplicationStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/positions/{id}")
    @Operation(summary = "Get position by ID", description = "Get detailed position information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Position not found")
    })
    public ResponseEntity<PositionDetailDTO> getPositionById(@PathVariable String id) {
        PositionDetailDTO response = recruitmentService.getPositionById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/positions/{id}")
    @Operation(summary = "Update position", description = "Update recruitment position")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Position updated successfully"),
            @ApiResponse(responseCode = "404", description = "Position not found")
    })
    public ResponseEntity<UpdatePositionResponseDTO> updatePosition(
            @PathVariable String id,
            @Valid @RequestBody CreatePositionRequestDTO request) {
        UpdatePositionResponseDTO response = recruitmentService.updatePosition(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/positions/{id}")
    @Operation(summary = "Delete position", description = "Delete a recruitment position")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Position deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Position not found")
    })
    public ResponseEntity<DeletePositionResponseDTO> deletePosition(@PathVariable String id) {
        DeletePositionResponseDTO response = recruitmentService.deletePosition(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/applications/{id}/interview")
    @Operation(summary = "Schedule interview", description = "Schedule an interview for an application")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Interview scheduled successfully"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    public ResponseEntity<ScheduleInterviewResponseDTO> scheduleInterview(
            @PathVariable String id,
            @Valid @RequestBody ScheduleInterviewRequestDTO request) {
        ScheduleInterviewResponseDTO response = recruitmentService.scheduleInterview(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/applications/{id}/rate")
    @Operation(summary = "Rate candidate", description = "Rate a candidate")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Candidate rated successfully"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    public ResponseEntity<RateCandidateResponseDTO> rateCandidate(
            @PathVariable String id,
            @Valid @RequestBody RateCandidateRequestDTO request) {
        RateCandidateResponseDTO response = recruitmentService.rateCandidate(id, request);
        return ResponseEntity.ok(response);
    }
}

