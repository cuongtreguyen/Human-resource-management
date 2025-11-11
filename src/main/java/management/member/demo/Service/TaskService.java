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

import java.util.List;

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
        task.setTaskStatus(TaskStatus.AWAITING);

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
        return taskRepository.findAll().stream()
                .filter(task -> task.getTaskStatus() == status)
                .count();
    }

    public TaskResponse viewTaskDetails(Long taskId){
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return taskMapper.toTaskResponse(task);
    }
}
