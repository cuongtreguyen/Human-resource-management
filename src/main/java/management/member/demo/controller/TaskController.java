package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.Enum.TaskStatus;
import management.member.demo.Service.TaskService;
import management.member.demo.dto.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Task Management", description = "Task management endpoints")
public class TaskController {

    private final TaskService service;

    @GetMapping("/findTaskByStatus")
    public ResponseEntity<List<TaskResponse>> findTaskByStatus(@RequestParam("status")TaskStatus status){
        return ResponseEntity.ok(service.findTaskByStatus(status));
    }

    @GetMapping("/countTaskByStatus")
    public ResponseEntity<Long> countTaskByStatus(@RequestParam(required = false) TaskStatus status){
        return ResponseEntity.ok(service.countTaskByStatus(status));
    }

    @GetMapping("/employee-completion-percent")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeCompletionPercent(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate",   required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(service.employeeCompletionPercentAsMaps(startDate, endDate));
    }

    @GetMapping("/employee-efficiency")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeEfficiency(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate",   required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(service.employeeEfficiencyAsMaps(startDate, endDate));
    }

    @GetMapping("/average-days")
    public ResponseEntity<Double> getAverageDaysForCompletedTasks(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate",   required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        double avg = service.averageDaysForCompleted(startDate, endDate);
        return ResponseEntity.ok(avg);
    }

    // New endpoints according to API spec
    @GetMapping
    @Operation(summary = "Get all tasks", description = "Get all tasks with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<TaskListResponseDTO> getAllTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String assigneeId,
            @RequestParam(required = false) String department) {
        TaskListResponseDTO response = service.getAllTasks(status, priority, assigneeId, department);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create task", description = "Create a new task")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Task created successfully")
    })
    public ResponseEntity<CreateTaskResponseDTO> createTask(
            @Valid @RequestBody CreateTaskRequestDTO request) {
        CreateTaskResponseDTO response = service.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task", description = "Update task information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Task updated successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<UpdateTaskResponseDTO> updateTask(
            @PathVariable String id,
            @Valid @RequestBody UpdateTaskRequestDTO request) {
        UpdateTaskResponseDTO response = service.updateTask(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by id", description = "Get task detail by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<TaskDetailDTO> getTaskById(@PathVariable String id) {
        TaskDetailDTO response = service.getTaskById(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task", description = "Delete a task")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Task deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<DeleteTaskResponseDTO> deleteTask(@PathVariable String id) {
        DeleteTaskResponseDTO response = service.deleteTask(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/progress")
    @Operation(summary = "Get task progress", description = "Get progress information for a task")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<TaskProgressDTO> getTaskProgress(@PathVariable String id) {
        TaskProgressDTO response = service.getTaskProgress(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/progress")
    @Operation(summary = "Update task progress", description = "Update progress for a task")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Progress updated successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<UpdateTaskProgressResponseDTO> updateTaskProgress(
            @PathVariable String id,
            @Valid @RequestBody UpdateTaskProgressRequestDTO request) {
        UpdateTaskProgressResponseDTO response = service.updateTaskProgress(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/assignees")
    @Operation(summary = "Get task assignees", description = "Get list of available task assignees")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<TaskAssigneeListResponseDTO> getTaskAssignees() {
        TaskAssigneeListResponseDTO response = service.getTaskAssignees();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}/summary")
    @Operation(summary = "Get employee task summary", description = "Get task summary for an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeeTaskSummaryDTO> getEmployeeTaskSummary(@PathVariable String employeeId) {
        EmployeeTaskSummaryDTO response = service.getEmployeeTaskSummary(employeeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/notifications")
    @Operation(summary = "Get task notifications", description = "Get task-related notifications")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<TaskNotificationListResponseDTO> getTaskNotifications() {
        TaskNotificationListResponseDTO response = service.getTaskNotifications();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/timeline")
    @Operation(summary = "Get task timeline", description = "Get task timeline for a specific month")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<TaskTimelineResponseDTO> getTaskTimeline(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        TaskTimelineResponseDTO response = service.getTaskTimeline(year, month);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get task analytics", description = "Get task analytics and statistics")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<TaskAnalyticsDTO> getTaskAnalytics() {
        TaskAnalyticsDTO response = service.getTaskAnalytics();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/metrics/evaluation")
    @Operation(summary = "Get task metrics for evaluation", description = "Get task metrics for employee evaluation")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<TaskMetricsForEvaluationDTO> getTaskMetricsForEvaluation(
            @RequestParam(required = true) String employeeId,
            @RequestParam(required = true) String startDate,
            @RequestParam(required = true) String endDate) {
        TaskMetricsForEvaluationDTO response = service.getTaskMetricsForEvaluation(employeeId, startDate, endDate);
        return ResponseEntity.ok(response);
    }
}
