package management.member.demo.Service;

import management.member.demo.Enum.TaskStatus;
import management.member.demo.Enum.TaskPriorityStatus;
import management.member.demo.validator.TaskValidator;
import management.member.demo.Mapper.TaskMapper;
import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.entity.Task;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    TaskMapper taskMapper;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    TaskValidator taskValidator;

    public TaskResponse createTask(TaskRequest request){
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Task task = taskMapper.toTask(request);
        task.setEmployee(employee);
        task.setTaskStatus(TaskStatus.PENDING);

        Task savedTask = taskRepository.save(task);
        return taskMapper.toTaskResponse(savedTask);
    }

    public TaskResponse updateTaskStatus(Long taskId, TaskStatus status){
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTaskStatus(status);
        Task updatedTask = taskRepository.save(task);
        return taskMapper.toTaskResponse(updatedTask);
    }

    public List<TaskResponse> findTaskByStatus(TaskStatus status){
        List<Task> tasks = taskRepository.findAll().stream()
                .filter(task -> task.getTaskStatus() == status)
                .toList();
        if(tasks.isEmpty()){
            throw ErrorCode.NO_TASKS_FOUND.toException("Không tìm thấy task nào với trạng thái: " + status);
        }
        return tasks.stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    public Long countTaskByStatus(TaskStatus status){
        if(status == null){
            return taskRepository.count();
        }
        return taskRepository.countByTaskStatus(status);
    }

    public TaskResponse viewTaskDetails(Long taskId){
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> ErrorCode.TASK_NOT_FOUND.toException("Task không tồn tại với ID: " + taskId));
        return taskMapper.toTaskResponse(task);
    }

    public List<TaskResponse> searchTaskByTitle(String title){
        List<Task> tasks = taskRepository.findByTitleContainingIgnoreCase(title);
        if(tasks.isEmpty()){
            throw ErrorCode.NO_TASKS_FOUND.toException("Không tìm thấy task nào với tiêu đề chứa: " + title);
        }
        return tasks.stream()
                .map(taskMapper::toTaskResponse)
                .toList();
    }

    // 1) Average days for COMPLETED (with optional date filter)
    public double averageDaysForCompleted(LocalDate start, LocalDate end) {
        List<Object[]> rows = taskRepository.findStartEndByStatusBetweenDates(TaskStatus.COMPLETED, start, end);

        // rows: [startDate, endDate]
        double avg = rows.stream()
                .filter(r -> r[0] != null && r[1] != null)
                .mapToLong(r -> {
                    LocalDate s = (LocalDate) r[0];
                    LocalDate e = (LocalDate) r[1];
                    return ChronoUnit.DAYS.between(s, e);
                })
                .average()
                .orElse(0.0);

        // round to 1 decimal
        avg = Math.round(avg * 10.0) / 10.0;
        return avg;
    }

    // Efficiency per employee (100% - %cancelled)
    public List<Map<String, Object>> employeeEfficiencyAsMaps(LocalDate start, LocalDate end) {
        List<Object[]> totalByEmp = taskRepository.countTasksGroupedByEmployeeBetweenDates(start, end);
        List<Object[]> cancelledByEmp = taskRepository.countTasksGroupedByEmployeeAndStatusBetweenDates(TaskStatus.CANCELLED, start, end);

        Map<Long, Long> totalMap = totalByEmp.stream().collect(Collectors.toMap(
                r -> ((Number) r[0]).longValue(),
                r -> ((Number) r[2]).longValue()
        ));
        Map<Long, Long> cancelledMap = cancelledByEmp.stream().collect(Collectors.toMap(
                r -> ((Number) r[0]).longValue(),
                r -> ((Number) r[2]).longValue()
        ));
        Map<Long, String> nameMap = totalByEmp.stream().collect(Collectors.toMap(
                r -> ((Number) r[0]).longValue(),
                r -> (String) r[1]
        ));

        List<Map<String, Object>> out = new ArrayList<>();
        for (Map.Entry<Long, Long> e : totalMap.entrySet()) {
            Long empId = e.getKey();
            long total = e.getValue();
            long cancelled = cancelledMap.getOrDefault(empId, 0L);
            double eff = total == 0 ? 0.0 : ((total - cancelled) * 100.0 / total);
            eff = Math.round(eff); // integer %

            Map<String, Object> m = new HashMap<>();
            m.put("employeeId", empId);
            m.put("employeeName", nameMap.get(empId));
            m.put("totalTasks", total);
            m.put("cancelledTasks", cancelled);
            m.put("efficiency", eff);
            out.add(m);
        }
        out.sort((a, b) -> Double.compare((Double) b.get("efficiency"), (Double) a.get("efficiency")));
        return out;
    }

    // Completed % per employee -> trả về List<Map> với keys: employeeId, employeeName, percentage, total, completed
    public List<Map<String, Object>> employeeCompletionPercentAsMaps(LocalDate start, LocalDate end) {
        List<Object[]> totalByEmp = taskRepository.countTasksGroupedByEmployeeBetweenDates(start, end);
        List<Object[]> completedByEmp = taskRepository.countTasksGroupedByEmployeeAndStatusBetweenDates(TaskStatus.COMPLETED, start, end);

        Map<Long, Long> totalMap = totalByEmp.stream().collect(Collectors.toMap(
                r -> ((Number) r[0]).longValue(),
                r -> ((Number) r[2]).longValue()
        ));
        Map<Long, Long> completedMap = completedByEmp.stream().collect(Collectors.toMap(
                r -> ((Number) r[0]).longValue(),
                r -> ((Number) r[2]).longValue()
        ));
        Map<Long, String> nameMap = totalByEmp.stream().collect(Collectors.toMap(
                r -> ((Number) r[0]).longValue(),
                r -> (String) r[1]
        ));

        List<Map<String, Object>> out = new ArrayList<>();
        for (Map.Entry<Long, Long> e : totalMap.entrySet()) {
            Long empId = e.getKey();
            long total = e.getValue();
            long completed = completedMap.getOrDefault(empId, 0L);
            double pct = total == 0 ? 0.0 : (completed * 100.0 / total);
            pct = Math.round(pct * 10.0) / 10.0;

            Map<String, Object> m = new HashMap<>();
            m.put("employeeId", empId);
            m.put("employeeName", nameMap.get(empId));
            m.put("totalTasks", total);
            m.put("completedTasks", completed);
            m.put("percentage", pct);
            out.add(m);
        }
        out.sort((a, b) -> Double.compare((Double) b.get("percentage"), (Double) a.get("percentage")));
        return out;
    }

    // New methods for API spec
    public TaskListResponseDTO getAllTasks(String status, String priority, String assigneeId, String department) {
        List<Task> tasks = taskRepository.findAll();
        
        // Filter by status
        if (status != null && !status.trim().isEmpty()) {
            try {
                TaskStatus statusEnum = TaskStatus.valueOf(status.toUpperCase());
                tasks = tasks.stream()
                        .filter(t -> t.getTaskStatus() == statusEnum)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore filter
            }
        }
        
        // Filter by priority
        if (priority != null && !priority.trim().isEmpty()) {
            try {
                TaskPriorityStatus priorityEnum = TaskPriorityStatus.valueOf(priority.toUpperCase());
                tasks = tasks.stream()
                        .filter(t -> t.getTaskPriorityStatus() == priorityEnum)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid priority, ignore filter
            }
        }
        
        // Filter by assigneeId
        if (assigneeId != null && !assigneeId.trim().isEmpty()) {
            try {
                Long empId = Long.parseLong(assigneeId);
                tasks = tasks.stream()
                        .filter(t -> t.getEmployee() != null && t.getEmployee().getId().equals(empId))
                        .collect(Collectors.toList());
            } catch (NumberFormatException e) {
                // Invalid assigneeId, ignore filter
            }
        }
        
        // Filter by department
        if (department != null && !department.trim().isEmpty()) {
            tasks = tasks.stream()
                    .filter(t -> t.getEmployee() != null && department.equals(t.getEmployee().getDepartment()))
                    .collect(Collectors.toList());
        }
        
        TaskListResponseDTO response = new TaskListResponseDTO();
        response.setData(tasks.stream()
                .map(this::mapToTaskListItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public CreateTaskResponseDTO createTask(CreateTaskRequestDTO request) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        taskValidator.validateCreateTaskRequest(request);
        
        Long assigneeId = Long.parseLong(request.getAssigneeId());
        Employee employee = employeeRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getAssigneeId()));
        
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setEmployee(employee);
        task.setTaskStatus(TaskStatus.PENDING);
        
        // Map priority
        if (request.getPriority() != null) {
            try {
                task.setTaskPriorityStatus(TaskPriorityStatus.valueOf(request.getPriority().toUpperCase()));
            } catch (IllegalArgumentException e) {
                task.setTaskPriorityStatus(TaskPriorityStatus.MEDIUM);
            }
        } else {
            task.setTaskPriorityStatus(TaskPriorityStatus.MEDIUM);
        }
        
        task.setCreatedAt(request.getStartDate() != null ? request.getStartDate() : LocalDate.now());
        task.setEndedAt(request.getEndDate());
        
        Task saved = taskRepository.save(task);
        
        CreateTaskResponseDTO response = new CreateTaskResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setTitle(saved.getTitle());
        response.setMessage("Task created successfully");
        response.setSuccess(true);
        
        return response;
    }

    public UpdateTaskResponseDTO updateTask(String id, UpdateTaskRequestDTO request) {
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            try {
                task.setTaskStatus(TaskStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw ErrorCode.INVALID_TASK_STATUS.toException("Trạng thái không hợp lệ: " + request.getStatus());
            }
        }
        if (request.getPriority() != null) {
            try {
                task.setTaskPriorityStatus(TaskPriorityStatus.valueOf(request.getPriority().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw ErrorCode.INVALID_TASK_PRIORITY.toException("Độ ưu tiên không hợp lệ: " + request.getPriority());
            }
        }
        if (request.getStartDate() != null) {
            task.setCreatedAt(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            task.setEndedAt(request.getEndDate());
        }
        
        taskRepository.save(task);
        
        UpdateTaskResponseDTO response = new UpdateTaskResponseDTO();
        response.setId(id);
        response.setMessage("Task updated successfully");
        response.setSuccess(true);
        
        return response;
    }

    public TaskDetailDTO getTaskById(String id) {
        taskValidator.validateTaskIdString(id); // Validate trước khi parse
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        return mapToTaskDetailDTO(task);
    }

    public DeleteTaskResponseDTO deleteTask(String id) {
        taskValidator.validateTaskIdString(id); // Validate trước khi parse
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        taskRepository.delete(task);
        
        DeleteTaskResponseDTO response = new DeleteTaskResponseDTO();
        response.setId(id);
        response.setMessage("Task deleted successfully");
        response.setSuccess(true);
        
        return response;
    }

    public TaskProgressDTO getTaskProgress(String id) {
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        TaskProgressDTO dto = new TaskProgressDTO();
        dto.setTaskId(id);
        dto.setCurrentProgress(0); // TODO: Add progress field to Task entity
        dto.setMilestones(new ArrayList<>()); // TODO: Add milestones to Task entity
        dto.setTimeSpent(0); // TODO: Add timeSpent field to Task entity
        dto.setEstimatedTime(0); // TODO: Add estimatedTime field to Task entity
        dto.setLastUpdate(LocalDateTime.now());
        
        return dto;
    }

    public UpdateTaskProgressResponseDTO updateTaskProgress(String id, UpdateTaskProgressRequestDTO request) {
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        // TODO: Update progress field in Task entity
        // For now, just update status if progress is 100
        if (request.getCurrentProgress() != null && request.getCurrentProgress() >= 100) {
            task.setTaskStatus(TaskStatus.COMPLETED);
            task.setEndedAt(LocalDate.now());
        } else if (request.getCurrentProgress() != null && request.getCurrentProgress() > 0) {
            task.setTaskStatus(TaskStatus.IN_PROGRESS);
        }
        
        taskRepository.save(task);
        
        UpdateTaskProgressResponseDTO response = new UpdateTaskProgressResponseDTO();
        response.setTaskId(id);
        response.setMessage("Task progress updated successfully");
        response.setSuccess(true);
        
        return response;
    }

    public TaskAssigneeListResponseDTO getTaskAssignees() {
        List<Employee> employees = employeeRepository.findAll();
        
        TaskAssigneeListResponseDTO response = new TaskAssigneeListResponseDTO();
        response.setData(employees.stream()
                .map(emp -> {
                    TaskAssigneeDTO dto = new TaskAssigneeDTO();
                    dto.setId(String.valueOf(emp.getId()));
                    dto.setName(emp.getFullName());
                    dto.setAvatar("/api/placeholder/150/150");
                    dto.setEmail(emp.getEmail());
                    dto.setDepartment(emp.getDepartment());
                    dto.setPosition(emp.getPosition());
                    return dto;
                })
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public EmployeeTaskSummaryDTO getEmployeeTaskSummary(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getEmployee() != null && t.getEmployee().getId().equals(empId))
                .collect(Collectors.toList());
        
        EmployeeTaskSummaryDTO dto = new EmployeeTaskSummaryDTO();
        dto.setEmployeeId(employeeId);
        dto.setTotalTasks(tasks.size());
        dto.setCompletedTasks((int) tasks.stream().filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED).count());
        dto.setInProgressTasks((int) tasks.stream().filter(t -> t.getTaskStatus() == TaskStatus.IN_PROGRESS).count());
        dto.setOverdueTasks((int) tasks.stream()
                .filter(t -> t.getEndedAt() != null && t.getEndedAt().isBefore(LocalDate.now()) && 
                           t.getTaskStatus() != TaskStatus.COMPLETED)
                .count());
        
        // Calculate average completion time
        List<Task> completedTasks = tasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED && 
                           t.getCreatedAt() != null && t.getEndedAt() != null)
                .collect(Collectors.toList());
        
        if (!completedTasks.isEmpty()) {
            double avgDays = completedTasks.stream()
                    .mapToLong(t -> ChronoUnit.DAYS.between(t.getCreatedAt(), t.getEndedAt()))
                    .average()
                    .orElse(0.0);
            dto.setAverageCompletionTime(Math.round(avgDays * 10.0) / 10.0);
        } else {
            dto.setAverageCompletionTime(0.0);
        }
        
        // Calculate productivity score (simplified)
        int productivityScore = 0;
        if (tasks.size() > 0) {
            double completionRate = (double) dto.getCompletedTasks() / tasks.size();
            productivityScore = (int) (completionRate * 100);
        }
        dto.setProductivityScore(productivityScore);
        
        // This week and next week tasks
        LocalDate now = LocalDate.now();
        LocalDate weekStart = now.minusDays(now.getDayOfWeek().getValue() - 1);
        LocalDate weekEnd = weekStart.plusDays(6);
        LocalDate nextWeekStart = weekEnd.plusDays(1);
        LocalDate nextWeekEnd = nextWeekStart.plusDays(6);
        
        dto.setThisWeekTasks((int) tasks.stream()
                .filter(t -> t.getCreatedAt() != null && 
                           !t.getCreatedAt().isBefore(weekStart) && 
                           !t.getCreatedAt().isAfter(weekEnd))
                .count());
        
        dto.setNextWeekTasks((int) tasks.stream()
                .filter(t -> t.getCreatedAt() != null && 
                           !t.getCreatedAt().isBefore(nextWeekStart) && 
                           !t.getCreatedAt().isAfter(nextWeekEnd))
                .count());
        
        return dto;
    }

    public TaskNotificationListResponseDTO getTaskNotifications() {
        // TODO: Implement actual notification retrieval
        TaskNotificationListResponseDTO response = new TaskNotificationListResponseDTO();
        response.setData(new ArrayList<>());
        response.setSuccess(true);
        return response;
    }

    public TaskTimelineResponseDTO getTaskTimeline(Integer year, Integer month) {
        int filterYear = year != null ? year : LocalDate.now().getYear();
        int filterMonth = month != null ? month : LocalDate.now().getMonthValue();
        
        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getCreatedAt() != null && 
                           t.getCreatedAt().getYear() == filterYear &&
                           t.getCreatedAt().getMonthValue() == filterMonth)
                .collect(Collectors.toList());
        
        TaskTimelineResponseDTO response = new TaskTimelineResponseDTO();
        response.setYear(filterYear);
        response.setMonth(filterMonth);
        response.setEvents(tasks.stream()
                .map(t -> {
                    TaskTimelineEventDTO event = new TaskTimelineEventDTO();
                    event.setId(t.getId());
                    event.setTitle(t.getTitle());
                    event.setStartDate(t.getCreatedAt());
                    event.setEndDate(t.getEndedAt());
                    event.setType(t.getTaskStatus() != null ? t.getTaskStatus().name().toLowerCase() : "pending");
                    event.setAssignee(t.getEmployee() != null ? t.getEmployee().getFullName() : null);
                    event.setStatus(t.getTaskStatus() != null ? t.getTaskStatus().name().toLowerCase() : "pending");
                    event.setColor("#3498db"); // Default color
                    return event;
                })
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public TaskAnalyticsDTO getTaskAnalytics() {
        List<Task> tasks = taskRepository.findAll();
        
        TaskAnalyticsDTO dto = new TaskAnalyticsDTO();
        
        TaskAnalyticsDTO.OverviewDTO overview = new TaskAnalyticsDTO.OverviewDTO();
        overview.setTotalTasks(tasks.size());
        overview.setCompletedTasks((int) tasks.stream().filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED).count());
        overview.setInProgressTasks((int) tasks.stream().filter(t -> t.getTaskStatus() == TaskStatus.IN_PROGRESS).count());
        overview.setOverdueTasks((int) tasks.stream()
                .filter(t -> t.getEndedAt() != null && t.getEndedAt().isBefore(LocalDate.now()) && 
                           t.getTaskStatus() != TaskStatus.COMPLETED)
                .count());
        
        if (tasks.size() > 0) {
            overview.setCompletionRate(Math.round((double) overview.getCompletedTasks() / tasks.size() * 100.0 * 10.0) / 10.0);
        } else {
            overview.setCompletionRate(0.0);
        }
        dto.setOverview(overview);
        
        TaskAnalyticsDTO.ProductivityDTO productivity = new TaskAnalyticsDTO.ProductivityDTO();
        List<Task> completedTasks = tasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED && 
                           t.getCreatedAt() != null && t.getEndedAt() != null)
                .collect(Collectors.toList());
        
        if (!completedTasks.isEmpty()) {
            double avgDays = completedTasks.stream()
                    .mapToLong(t -> ChronoUnit.DAYS.between(t.getCreatedAt(), t.getEndedAt()))
                    .average()
                    .orElse(0.0);
            productivity.setAverageCompletionTime(Math.round(avgDays * 10.0) / 10.0);
        } else {
            productivity.setAverageCompletionTime(0.0);
        }
        
        long uniqueEmployees = tasks.stream()
                .filter(t -> t.getEmployee() != null)
                .map(t -> t.getEmployee().getId())
                .distinct()
                .count();
        
        if (uniqueEmployees > 0) {
            productivity.setTasksPerEmployee(Math.round((double) tasks.size() / uniqueEmployees * 10.0) / 10.0);
        } else {
            productivity.setTasksPerEmployee(0.0);
        }
        
        // Calculate efficiency score
        int efficiencyScore = 0;
        if (tasks.size() > 0) {
            double completionRate = (double) overview.getCompletedTasks() / tasks.size();
            efficiencyScore = (int) (completionRate * 100);
        }
        productivity.setEfficiencyScore(efficiencyScore);
        dto.setProductivity(productivity);
        
        dto.setSuccess(true);
        return dto;
    }

    public TaskMetricsForEvaluationDTO getTaskMetricsForEvaluation(String employeeId, String startDate, String endDate) {
        Long empId = Long.parseLong(employeeId);
        employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getEmployee() != null && t.getEmployee().getId().equals(empId) &&
                           t.getCreatedAt() != null &&
                           !t.getCreatedAt().isBefore(start) &&
                           !t.getCreatedAt().isAfter(end))
                .collect(Collectors.toList());
        
        TaskMetricsForEvaluationDTO dto = new TaskMetricsForEvaluationDTO();
        
        TaskMetricsForEvaluationDTO.StatsDTO stats = new TaskMetricsForEvaluationDTO.StatsDTO();
        stats.setTotal(tasks.size());
        stats.setTodo((int) tasks.stream().filter(t -> t.getTaskStatus() == TaskStatus.PENDING).count());
        stats.setInProgress((int) tasks.stream().filter(t -> t.getTaskStatus() == TaskStatus.IN_PROGRESS).count());
        stats.setReview(0); // TaskStatus doesn't have REVIEW, set to 0
        stats.setDone((int) tasks.stream().filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED).count());
        dto.setStats(stats);
        
        if (tasks.size() > 0) {
            dto.setCompletionRate(Math.round((double) stats.getDone() / tasks.size() * 100.0 * 10.0) / 10.0);
        } else {
            dto.setCompletionRate(0.0);
        }
        
        // Calculate on-time rate
        long onTimeTasks = tasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED &&
                           t.getEndedAt() != null &&
                           (t.getCreatedAt() == null || !t.getEndedAt().isAfter(t.getCreatedAt().plusDays(7))))
                .count();
        
        if (stats.getDone() > 0) {
            dto.setOnTimeRate(Math.round((double) onTimeTasks / stats.getDone() * 100.0 * 10.0) / 10.0);
        } else {
            dto.setOnTimeRate(0.0);
        }
        
        // Calculate high priority rate
        long highPriorityTasks = tasks.stream()
                .filter(t -> t.getTaskPriorityStatus() == TaskPriorityStatus.HIGH)
                .count();
        
        if (tasks.size() > 0) {
            dto.setHighPriorityRate(Math.round((double) highPriorityTasks / tasks.size() * 100.0 * 10.0) / 10.0);
        } else {
            dto.setHighPriorityRate(0.0);
        }
        
        // Calculate productivity score
        int productivityScore = 0;
        if (tasks.size() > 0) {
            double completionRate = (double) stats.getDone() / tasks.size();
            productivityScore = (int) (completionRate * 100);
        }
        dto.setProductivityScore(productivityScore);
        dto.setSuccess(true);
        
        return dto;
    }

    private TaskListItemDTO mapToTaskListItemDTO(Task task) {
        TaskListItemDTO dto = new TaskListItemDTO();
        dto.setId(String.valueOf(task.getId()));
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getTaskStatus() != null ? task.getTaskStatus().name().toLowerCase() : "pending");
        dto.setPriority(task.getTaskPriorityStatus() != null ? task.getTaskPriorityStatus().name().toLowerCase() : "medium");
        
        if (task.getEmployee() != null) {
            TaskListItemDTO.AssigneeInfo assignee = new TaskListItemDTO.AssigneeInfo();
            assignee.setId(String.valueOf(task.getEmployee().getId()));
            assignee.setName(task.getEmployee().getFullName());
            assignee.setAvatar("/api/placeholder/150/150");
            dto.setAssignee(assignee);
        }
        
        dto.setStartDate(task.getCreatedAt());
        dto.setEndDate(task.getEndedAt());
        dto.setCreatedAt(task.getCreatedAt() != null ? 
                task.getCreatedAt().atStartOfDay() : LocalDateTime.now());
        dto.setUpdatedAt(LocalDateTime.now()); // TODO: Add updatedAt field to Task entity
        
        return dto;
    }

    private TaskDetailDTO mapToTaskDetailDTO(Task task) {
        TaskDetailDTO dto = new TaskDetailDTO();
        dto.setId(String.valueOf(task.getId()));
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getTaskStatus() != null ? task.getTaskStatus().name().toLowerCase() : "pending");
        dto.setPriority(task.getTaskPriorityStatus() != null ? task.getTaskPriorityStatus().name().toLowerCase() : "medium");
        
        if (task.getEmployee() != null) {
            TaskDetailDTO.AssigneeInfo assignee = new TaskDetailDTO.AssigneeInfo();
            assignee.setId(String.valueOf(task.getEmployee().getId()));
            assignee.setName(task.getEmployee().getFullName());
            assignee.setAvatar("/api/placeholder/150/150");
            dto.setAssignee(assignee);
        }
        
        dto.setStartDate(task.getCreatedAt());
        dto.setEndDate(task.getEndedAt());
        dto.setCreatedAt(task.getCreatedAt() != null ? 
                task.getCreatedAt().atStartOfDay() : LocalDateTime.now());
        dto.setUpdatedAt(LocalDateTime.now()); // TODO: Add updatedAt field to Task entity
        
        return dto;
    }
}
