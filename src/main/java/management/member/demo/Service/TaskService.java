package management.member.demo.Service;

import management.member.demo.Enum.TaskStatus;
import management.member.demo.Mapper.TaskMapper;
import management.member.demo.dto.TaskRequest;
import management.member.demo.dto.TaskResponse;
import management.member.demo.entity.Employee;
import management.member.demo.entity.Task;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    TaskMapper taskMapper;

    @Autowired
    TaskRepository taskRepository;

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
            throw new RuntimeException("No tasks found with status: " + status);
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
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return taskMapper.toTaskResponse(task);
    }

    public List<TaskResponse> searchTaskByTitle(String title){
        List<Task> tasks = taskRepository.findByTitleContainingIgnoreCase(title);
        if(tasks.isEmpty()){
            throw new RuntimeException("No tasks found with title containing: " + title);
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
}
