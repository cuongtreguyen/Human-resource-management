package management.member.demo.mapper;

import management.member.demo.dto.EmployeeByDepartmentDTO;
import management.member.demo.dto.TaskAssigneeDTO;
import management.member.demo.dto.TaskListItemDTO;
import management.member.demo.dto.TaskRequest;
import management.member.demo.dto.TaskResponse;
import management.member.demo.entity.Employee;
import management.member.demo.entity.Task;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toTask(TaskRequest request);

    TaskResponse toTaskResponse(Task task);

    default TaskListItemDTO toTaskListItemDTO(Task task) {
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

    default TaskAssigneeDTO toTaskAssigneeDTO(Employee emp) {
        TaskAssigneeDTO dto = new TaskAssigneeDTO();
        dto.setId(String.valueOf(emp.getId()));
        dto.setName(emp.getFullName());
        dto.setEmail(emp.getEmail());
        dto.setDepartment(emp.getDepartment());
        dto.setPosition(emp.getPosition());
        return dto;
    }

    default EmployeeByDepartmentDTO toEmployeeByDepartmentDTO(Employee emp) {
        return EmployeeByDepartmentDTO.builder()
                .fullName(emp.getFullName())
                .department(emp.getDepartment())
                .build();
    }
}
