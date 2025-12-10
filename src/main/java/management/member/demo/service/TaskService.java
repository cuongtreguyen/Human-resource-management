package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Board;
import management.member.demo.entity.Task;
import management.member.demo.entity.Employee;
import management.member.demo.entity.User;
import management.member.demo.enums.Role;
import management.member.demo.enums.TaskStatus;
import management.member.demo.enums.TaskPriorityStatus;
import management.member.demo.enums.TaskTag;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.CommentMapper;
import management.member.demo.mapper.TaskMapper;
import management.member.demo.repository.BoardRepository;
import management.member.demo.repository.TaskRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    BoardRepository boardRepository;

    @Autowired
    CommentMapper commentMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TaskMapper taskMapper;

    @Autowired
    private AuthService authService;

    private Employee getPrimaryAssignee(Task task) {
        if (task.getEmployees() != null && !task.getEmployees().isEmpty()) {
            return task.getEmployees().get(0); // Lấy người đầu tiên
        }
        return null;
    }

    public List<TaskResponse> findTaskByStatus(TaskStatus status) {
        return taskRepository.findAll().stream()
                .filter(t -> t.getTaskStatus() == status)
                .map(taskMapper::toTaskResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getTaskStatisticsGeneral() {
        // 1. Khởi tạo map với tất cả status = 0 (để tránh trả về null hoặc thiếu key)
        Map<String, Long> stats = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            stats.put(status.name(), 0L);
        }

        // 2. Lấy dữ liệu từ DB
        List<Object[]> results = taskRepository.countTotalTasksGroupedByStatus();

        // 3. Map dữ liệu vào
        for (Object[] row : results) {
            TaskStatus status = (TaskStatus) row[0];
            Long count = (Long) row[1];
            if (status != null) {
                stats.put(status.name(), count);
            }
        }
        return stats;
    }

    /**
     * Thống kê task theo status của MỘT Board cụ thể
     */
    public BoardTaskStatDTO getTaskStatisticsBySingleBoard(Long boardId) {
        // 1. Kiểm tra Board có tồn tại không (để lấy tên Board luôn)
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found with id: " + boardId));

        // 2. Khởi tạo DTO
        BoardTaskStatDTO dto = new BoardTaskStatDTO();
        dto.setBoardId(board.getId());
        dto.setTotalTasks(0L);
        dto.setStats(new HashMap<>());

        // 3. Khởi tạo tất cả status = 0 (quan trọng để vẽ biểu đồ không bị lỗi null)
        for (TaskStatus status : TaskStatus.values()) {
            dto.getStats().put(status.name(), 0L);
        }

        // 4. Lấy dữ liệu từ DB
        List<Object[]> results = taskRepository.countTasksByBoardId(boardId);

        // 5. Map dữ liệu vào DTO
        for (Object[] row : results) {
            TaskStatus status = (TaskStatus) row[0];
            Long count = (Long) row[1];

            if (status != null) {
                dto.getStats().put(status.name(), count);
                dto.setTotalTasks(dto.getTotalTasks() + count); // Cộng dồn tổng
            }
        }

        return dto;
    }

    public List<Map<String, Object>> employeeCompletionPercentAsMaps(LocalDate startDate, LocalDate endDate) {
        // Implementation for employee completion percent
        return List.of();
    }

    public List<Map<String, Object>> getEmployeeEfficiency(LocalDate startDate, LocalDate endDate) {
        // Implementation for employee efficiency
        return List.of();
    }

    public Double getAverageDaysToComplete(TaskStatus status, LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = taskRepository.findStartEndByStatusBetweenDates(status, startDate, endDate);
        if (results.isEmpty()) {
            return 0.0;
        }

        double totalDays = results.stream()
                .mapToDouble(result -> {
                    LocalDate start = (LocalDate) result[0];
                    LocalDate end = (LocalDate) result[1];
                    return java.time.temporal.ChronoUnit.DAYS.between(start, end);
                })
                .sum();

        return totalDays / results.size();
    }

    public TaskListResponseDTO getAllTasks(String status, String priority, String assigneeId, String department) {
        List<Task> tasks = taskRepository.findAll();

        // Apply filters
        if (status != null && !status.isEmpty()) {
            try {
                TaskStatus statusEnum = TaskStatus.valueOf(status.toUpperCase().replace("-", "_"));
                tasks = tasks.stream()
                        .filter(t -> t.getTaskStatus() == statusEnum)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid status, return all
            }
        }

        if (assigneeId != null && !assigneeId.isEmpty()) {
            Long empId = Long.parseLong(assigneeId);
            // SỬA: Kiểm tra xem empId có nằm trong danh sách employees của task không
            tasks = tasks.stream()
                    .filter(t -> t.getEmployees() != null &&
                            t.getEmployees().stream().anyMatch(e -> e.getId().equals(empId)))
                    .collect(Collectors.toList());
        }

        List<TaskListItemDTO> taskDTOs = tasks.stream()
                .map(this::toTaskListItemDTO)
                .collect(Collectors.toList());

        TaskListResponseDTO response = new TaskListResponseDTO();
        response.setData(taskDTOs);
        response.setSuccess(true);

        return response;
    }

    public CreateTaskResponseDTO createTask(CreateTaskRequestDTO request) {
        User user = authService.getCurrentUser();
        // Check quyền Manager nếu cần thiết (hoặc nới lỏng nếu nhân viên cũng được tạo task)
        if(!user.getRole().equals(Role.MANAGER)){
            // throw new ResourceNotFoundException(ErrorCode.TASK_NOT_PERMITTED.getMessage());
        }

        // 1. Tìm Board
        Board board = null;
        if (request.getBoardId() != null) {
            board = boardRepository.findById(request.getBoardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setBoard(board);

        // 2. Set giá trị mặc định (Vì UI tạo nhanh không nhập mấy cái này)
        task.setDescription("");
        task.setTaskStatus(TaskStatus.NEW); // Mặc định là Mới/Todo
        task.setTaskPriorityStatus(TaskPriorityStatus.MEDIUM); // Mặc định Trung bình
        task.setCreatedAt(LocalDate.now());
        task.setEmployees(new ArrayList<>()); // Chưa có ai làm

        Task saved = taskRepository.save(task);

        // 3. Trả về response
        CreateTaskResponseDTO response = new CreateTaskResponseDTO();
        CreateTaskResponseDTO.TaskData data = new CreateTaskResponseDTO.TaskData();
        data.setId(String.valueOf(saved.getId()));
        data.setTitle(saved.getTitle());
        data.setStatus(saved.getTaskStatus().name().toLowerCase().replace("_", "-"));
        data.setCreatedAt(LocalDateTime.now());

        response.setData(data);
        response.setSuccess(true);
        response.setMessage("Task created successfully");

        return response;
    }

    public UpdateTaskResponseDTO updateTask(String id, UpdateTaskRequestDTO request) {
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        // 1. Update Title & Description
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());

        // 2. Update Status (Kéo thả thẻ)
        if (request.getStatus() != null) {
            try {
                task.setTaskStatus(TaskStatus.valueOf(request.getStatus().toUpperCase().replace("-", "_")));
            } catch (IllegalArgumentException e) {
                // Log error or ignore
            }
        }

        // 3. Update Priority (Độ ưu tiên)
        if (request.getPriority() != null) {
            try {
                task.setTaskPriorityStatus(TaskPriorityStatus.valueOf(request.getPriority().toUpperCase()));
            } catch (IllegalArgumentException e) { }
        }

        // 4. Update Deadline (Ngày hết hạn)
        if (request.getDeadline() != null) {
            task.setDeadline(request.getDeadline());
        }

        // 5. Update Tag (Nhãn)
        if (request.getTag() != null) {
            try {
                // Convert String từ request sang Enum TaskTag
                task.setTag(TaskTag.valueOf(request.getTag().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Nếu tag gửi lên không đúng Enum thì bỏ qua hoặc throw lỗi tùy bạn
            }
        }

        // 6. Update Assignees (Thêm thành viên)
        // Logic Add thêm (Append) thay vì Replace
        if (request.getAssigneeIds() != null && !request.getAssigneeIds().isEmpty()) {
            List<Employee> currentAssignees = task.getEmployees(); // Lấy danh sách hiện tại
            List<Employee> newAssignees = employeeRepository.findAllById(request.getAssigneeIds());

            for (Employee emp : newAssignees) {
                // Chỉ thêm nếu chưa có trong list (tránh trùng)
                if (!currentAssignees.contains(emp)) {
                    currentAssignees.add(emp);
                }
            }
            task.setEmployees(currentAssignees);
        }

        Task updated = taskRepository.save(task);

        UpdateTaskResponseDTO response = new UpdateTaskResponseDTO();
        response.setData(new UpdateTaskResponseDTO.TaskData());
        response.getData().setId(Long.parseLong(id));
        response.getData().setStatus(updated.getTaskStatus().name().toLowerCase().replace("_", "-"));
        response.getData().setUpdatedAt(LocalDateTime.now());
        response.setSuccess(true);
        response.setMessage("Task updated successfully");

        return response;
    }

    public TaskDetailDTO getTaskById(String id) {
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        TaskDetailDTO response = new TaskDetailDTO();
        TaskDetailDTO.TaskDetailData data = new TaskDetailDTO.TaskDetailData();

        data.setId(task.getId());
        data.setTitle(task.getTitle());
        data.setDescription(task.getDescription());
        data.setStatus(task.getTaskStatus().name().toLowerCase().replace("_", "-"));
        data.setPriority(task.getTaskPriorityStatus().name().toLowerCase());

        if (task.getTag() != null) {
            data.setTag(task.getTag().name());
        }

        // 1. Map Board Info
        if (task.getBoard() != null) {
            data.setBoardId(task.getBoard().getId());
            data.setBoardName(task.getBoard().getName());
        }

        // 2. Map Assignees (List)
        if (task.getEmployees() != null) {
            List<TaskDetailDTO.AssigneeInfo> assigneeDtos = task.getEmployees().stream().map(emp -> {
                TaskDetailDTO.AssigneeInfo info = new TaskDetailDTO.AssigneeInfo();
                info.setId(emp.getId());
                info.setName(emp.getFullName());
                return info;
            }).collect(Collectors.toList());
            data.setAssignees(assigneeDtos);
        }

        // 3. Map Comments (List)
        if (task.getComments() != null) {
            List<CommentResponse> commentDtos = task.getComments().stream()
                    .map(commentMapper::toResponse) // Dùng mapper bài trước
                    .collect(Collectors.toList());
            data.setComments(commentDtos);
        }

        response.setData(data);
        response.setSuccess(true);
        return response;
    }

    public DeleteTaskResponseDTO deleteTask(String id) {
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        taskRepository.delete(task);

        DeleteTaskResponseDTO response = new DeleteTaskResponseDTO();
        response.setData(new DeleteTaskResponseDTO.TaskData());
        response.getData().setId(Long.parseLong(id));
        response.setSuccess(true);
        response.setMessage("Task deleted successfully");

        return response;
    }

    public TaskProgressDTO getTaskProgress(String id) {
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        TaskProgressDTO response = new TaskProgressDTO();
        TaskProgressDTO.TaskProgressData data = new TaskProgressDTO.TaskProgressData();

        data.setTaskId(taskId);
        data.setCurrentProgress(0); // Mock progress
        data.setTimeSpent(0);
        data.setEstimatedTime(0);
        data.setLastUpdate(LocalDateTime.now());

        response.setData(data);
        response.setSuccess(true);
        return response;
    }

    public UpdateTaskProgressResponseDTO updateTaskProgress(String id, UpdateTaskProgressRequestDTO request) {
        Long taskId = Long.parseLong(id);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        UpdateTaskProgressResponseDTO response = new UpdateTaskProgressResponseDTO();
        response.setData(new UpdateTaskProgressResponseDTO.TaskProgressData());
        response.getData().setTaskId(taskId);
        response.getData().setCurrentProgress(request.getCurrentProgress());
        response.getData().setLastUpdate(LocalDateTime.now());
        response.setSuccess(true);
        response.setMessage("Task progress updated successfully");

        return response;
    }

    public TaskAssigneeListResponseDTO getTaskAssignees() {
        List<Employee> employees = employeeRepository.findAll();

        List<TaskAssigneeDTO> assignees = employees.stream()
                .map(emp -> {
                    TaskAssigneeDTO dto = new TaskAssigneeDTO();
                    dto.setId(String.valueOf(emp.getId()));
                    dto.setName(emp.getFullName());
                    dto.setDepartment(emp.getDepartment());
                    dto.setPosition(emp.getPosition());
                    dto.setEmail(emp.getEmail());
                    return dto;
                })
                .collect(Collectors.toList());

        TaskAssigneeListResponseDTO response = new TaskAssigneeListResponseDTO();
        response.setData(assignees);
        response.setSuccess(true);

        return response;
    }

    public List<Map<String, Object>> employeeEfficiencyAsMaps(LocalDate startDate, LocalDate endDate) {
        List<Task> tasks = taskRepository.findAll();
        // Filter by date range if provided
        if (startDate != null || endDate != null) {
            tasks = tasks.stream()
                    .filter(task -> {
                        if (task.getCreatedAt() == null) return false;
                        if (startDate != null && task.getCreatedAt().isBefore(startDate)) return false;
                        if (endDate != null && task.getCreatedAt().isAfter(endDate)) return false;
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        // Group by employee and calculate efficiency
        Map<Long, List<Task>> tasksByEmployee = new HashMap<>();
        for (Task task : tasks) {
            if (task.getEmployees() != null) {
                for (Employee emp : task.getEmployees()) {
                    tasksByEmployee.computeIfAbsent(emp.getId(), k -> new ArrayList<>()).add(task);
                }
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<Long, List<Task>> entry : tasksByEmployee.entrySet()) {
            List<Task> employeeTasks = entry.getValue();
            long completed = employeeTasks.stream()
                    .filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED)
                    .count();
            double efficiency = employeeTasks.isEmpty() ? 0.0 : (double) completed / employeeTasks.size() * 100;

            Map<String, Object> map = new java.util.HashMap<>();
            map.put("employeeId", entry.getKey());
            map.put("totalTasks", employeeTasks.size());
            map.put("completedTasks", completed);
            map.put("efficiency", efficiency);
            result.add(map);
        }

        return result;
    }

    public double averageDaysForCompleted(LocalDate startDate, LocalDate endDate) {
        List<Task> tasks = taskRepository.findAll();
        // Filter by date range if provided
        if (startDate != null || endDate != null) {
            tasks = tasks.stream()
                    .filter(task -> {
                        if (task.getCreatedAt() == null) return false;
                        if (startDate != null && task.getCreatedAt().isBefore(startDate)) return false;
                        if (endDate != null && task.getCreatedAt().isAfter(endDate)) return false;
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        List<Task> completedTasks = tasks.stream()
                .filter(task -> task.getTaskStatus() == TaskStatus.COMPLETED &&
                        task.getCreatedAt() != null &&
                        task.getDeadline() != null)
                .collect(Collectors.toList());

        if (completedTasks.isEmpty()) {
            return 0.0;
        }

        double totalDays = completedTasks.stream()
                .mapToLong(task -> java.time.temporal.ChronoUnit.DAYS.between(task.getCreatedAt(), task.getDeadline()))
                .sum();

        return totalDays / completedTasks.size();
    }

    public EmployeeTaskSummaryDTO getEmployeeTaskSummary(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getEmployees() != null &&
                        t.getEmployees().stream().anyMatch(e -> e.getId().equals(empId)))
                .collect(Collectors.toList());

        EmployeeTaskSummaryDTO response = new EmployeeTaskSummaryDTO();
        EmployeeTaskSummaryDTO.SummaryData data = new EmployeeTaskSummaryDTO.SummaryData();

        data.setEmployeeId(employeeId);
        data.setTotalTasks((long) tasks.size());
        data.setCompletedTasks(tasks.stream().filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED).count());
        data.setInProgressTasks(tasks.stream().filter(t -> t.getTaskStatus() == TaskStatus.IN_PROGRESS).count());

        response.setData(data);
        response.setSuccess(true);
        return response;
    }

    public TaskNotificationListResponseDTO getTaskNotifications() {
        TaskNotificationListResponseDTO response = new TaskNotificationListResponseDTO();
        response.setData(List.of()); // Mock empty list
        response.setSuccess(true);
        return response;
    }

    public TaskTimelineResponseDTO getTaskTimeline(Integer year, Integer month) {
        TaskTimelineResponseDTO response = new TaskTimelineResponseDTO();
        response.setData(List.of()); // Mock empty list
        response.setSuccess(true);
        return response;
    }

    public TaskAnalyticsDTO getTaskAnalytics() {
        TaskAnalyticsDTO response = new TaskAnalyticsDTO();
        TaskAnalyticsDTO.AnalyticsData data = new TaskAnalyticsDTO.AnalyticsData();

        // Get real data from database
        List<Task> allTasks = taskRepository.findAll();
        long totalTasks = allTasks.size();
        long completedTasks = allTasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED)
                .count();
        long inProgressTasks = allTasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.IN_PROGRESS)
                .count();
        long pendingTasks = allTasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.NEW)
                .count();

        double completionRate = totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0.0;

        data.setTotalTasks((int) totalTasks);
        data.setCompletedTasks((int) completedTasks);
        data.setInProgressTasks((int) inProgressTasks);
        data.setPendingTasks((int) pendingTasks);
        data.setCompletionRate(completionRate);

        response.setData(data);
        response.setSuccess(true);
        return response;
    }

    public TaskMetricsForEvaluationDTO getTaskMetricsForEvaluation(String employeeId, String startDate, String endDate) {
        TaskMetricsForEvaluationDTO response = new TaskMetricsForEvaluationDTO();
        TaskMetricsForEvaluationDTO.MetricsData data = new TaskMetricsForEvaluationDTO.MetricsData();
        data.setEmployeeId(employeeId);

        // Parse dates
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;

        // Get employee tasks
        Long empId = Long.parseLong(employeeId);
        List<Task> employeeTasks = taskRepository.findAll().stream()
                .filter(t -> t.getEmployees() != null &&
                        t.getEmployees().stream().anyMatch(e -> e.getId().equals(empId)))
                .filter(t -> {
                    if (start != null && t.getCreatedAt() != null && t.getCreatedAt().isBefore(start)) return false;
                    if (end != null && t.getCreatedAt() != null && t.getCreatedAt().isAfter(end)) return false;
                    return true;
                })
                .collect(Collectors.toList());

        // Calculate completion rate
        long totalTasks = employeeTasks.size();
        long completedTasks = employeeTasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED)
                .count();
        double completionRate = totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0.0;
        data.setCompletionRate(completionRate);

        // Calculate on-time completion rate
        long onTimeCompleted = employeeTasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED &&
                        t.getCreatedAt() != null &&
                        t.getDeadline() != null &&
                        !t.getDeadline().isAfter(t.getCreatedAt().plusDays(7)))
                .count();
        double onTimeCompletionRate = completedTasks > 0 ? (double) onTimeCompleted / completedTasks * 100 : 0.0;
        data.setOnTimeCompletionRate(onTimeCompletionRate);

        // Calculate average completion time
        List<Task> completedWithDates = employeeTasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED &&
                        t.getCreatedAt() != null &&
                        t.getDeadline() != null)
                .collect(Collectors.toList());

        double averageCompletionTime = 0.0;
        if (!completedWithDates.isEmpty()) {
            double totalDays = completedWithDates.stream()
                    .mapToLong(t -> java.time.temporal.ChronoUnit.DAYS.between(t.getCreatedAt(), t.getDeadline()))
                    .sum();
            averageCompletionTime = totalDays / completedWithDates.size();
        }
        data.setAverageCompletionTime(averageCompletionTime);

        response.setData(data);
        response.setSuccess(true);
        return response;
    }

    public CalculateTaskMetricsResponseDTO calculateTaskMetrics(CalculateTaskMetricsRequestDTO request) {
        List<Task> tasks;
        if (request.getTaskIds() != null && !request.getTaskIds().isEmpty()) {
            tasks = request.getTaskIds().stream()
                    .map(id -> {
                        try {
                            Long taskId = Long.parseLong(id);
                            return taskRepository.findById(taskId).orElse(null);
                        } catch (NumberFormatException e) {
                            return null;
                        }
                    })
                    .filter(task -> task != null)
                    .collect(Collectors.toList());
        } else {
            tasks = taskRepository.findAll();
        }

        CalculateTaskMetricsResponseDTO response = new CalculateTaskMetricsResponseDTO();
        CalculateTaskMetricsResponseDTO.MetricsData data = new CalculateTaskMetricsResponseDTO.MetricsData();

        // Calculate metrics (mocked as Task entity does not have these fields)
        int totalEstimatedHours = 0;
        data.setTotalEstimatedHours(totalEstimatedHours);

        int totalActualHours = 0;
        data.setTotalActualHours(totalActualHours);

        java.math.BigDecimal hourlyRate = new java.math.BigDecimal("100000");
        java.math.BigDecimal totalCost = hourlyRate.multiply(new java.math.BigDecimal(totalActualHours));
        data.setTotalCost(totalCost);

        int totalProgress = 0;
        int averageProgress = tasks.isEmpty() ? 0 : totalProgress / tasks.size();
        data.setAverageProgress(averageProgress);

        long completedOnTime = tasks.stream()
                .filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED &&
                        t.getDeadline() != null &&
                        (t.getCreatedAt() == null || !t.getDeadline().isAfter(t.getCreatedAt().plusDays(7))))
                .count();
        int onTimeCompletion = tasks.isEmpty() ? 0 : (int) (completedOnTime * 100 / tasks.size());
        data.setOnTimeCompletion(onTimeCompletion);

        long overdueTasks = tasks.stream()
                .filter(t -> t.getDeadline() != null &&
                        t.getDeadline().isBefore(LocalDate.now()) &&
                        t.getTaskStatus() != TaskStatus.COMPLETED)
                .count();
        data.setOverdueTasks((int) overdueTasks);

        int efficiencyScore = 85;
        if (totalEstimatedHours > 0) {
            double efficiency = (double) totalEstimatedHours / totalActualHours * 100;
            efficiencyScore = (int) Math.min(100, Math.max(0, efficiency));
        }
        data.setEfficiencyScore(efficiencyScore);

        List<String> recommendations = new ArrayList<>();
        if (overdueTasks > 0) {
            recommendations.add("Có " + overdueTasks + " công việc quá hạn, cần xử lý ngay");
        }
        if (efficiencyScore < 80) {
            recommendations.add("Hiệu suất thấp, cần cải thiện quy trình làm việc");
        }
        if (recommendations.isEmpty()) {
            recommendations.add("Mọi thứ đang diễn ra tốt");
        }
        data.setRecommendations(recommendations);

        response.setData(data);
        response.setSuccess(true);
        return response;
    }

    // API phục vụ cho cái Dropdown tìm kiếm trong hình
    public List<TaskAssigneeDTO> searchAssignees(String keyword, String department) {
        // Gọi Repository vừa viết ở Bước 1
        List<Employee> employees = employeeRepository.searchEmployees(keyword, department);

        // Convert sang DTO để trả về Frontend (Avatar, Tên, Phòng ban)
        return employees.stream().map(emp -> {
            TaskAssigneeDTO dto = new TaskAssigneeDTO();
            dto.setId(String.valueOf(emp.getId()));
            dto.setName(emp.getFullName());
            dto.setEmail(emp.getEmail());
            dto.setDepartment(emp.getDepartment());
            dto.setPosition(emp.getPosition());
            // dto.setAvatar(...) // Nếu có avatar
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Tìm kiếm nhân viên theo phòng ban
     * @param department Tên phòng ban để tìm kiếm
     * @return Danh sách nhân viên với fullName và department
     */
    public List<EmployeeByDepartmentDTO> searchEmployeesByDepartment(String department) {
        List<Employee> employees = employeeRepository.findByDepartment(department);
        
        return employees.stream()
                .map(emp -> EmployeeByDepartmentDTO.builder()
                        .fullName(emp.getFullName())
                        .department(emp.getDepartment())
                        .build())
                .collect(Collectors.toList());
    }

    private TaskListItemDTO toTaskListItemDTO(Task task) {
        TaskListItemDTO dto = new TaskListItemDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getTaskStatus().name().toLowerCase().replace("_", "-"));
        dto.setPriority(task.getTaskPriorityStatus().name().toLowerCase());

        if (task.getTag() != null) {
            dto.setTag(task.getTag().name());
        }

        if (task.getBoard() != null) {
            dto.setBoardId(task.getBoard().getId());
            dto.setBoardName(task.getBoard().getName());
        }
        dto.setCommentCount(task.getComments() != null ? task.getComments().size() : 0);

        if (task.getEmployees() != null) {
            List<TaskListItemDTO.AssigneeInfo> assigneeDtos = task.getEmployees().stream().map(emp -> {
                TaskListItemDTO.AssigneeInfo info = new TaskListItemDTO.AssigneeInfo();
                info.setId(emp.getId());
                info.setName(emp.getFullName());
                return info;
            }).collect(Collectors.toList());
            dto.setAssignees(assigneeDtos);
        }

        dto.setStartDate(task.getCreatedAt());
        dto.setEndDate(task.getDeadline());
        dto.setCreatedAt(task.getCreatedAt() != null ? task.getCreatedAt().atStartOfDay() : LocalDateTime.now());
        dto.setUpdatedAt(LocalDateTime.now());

        return dto;
    }
}

