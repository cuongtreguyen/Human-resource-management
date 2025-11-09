package management.member.demo.Mapper;

import management.member.demo.dto.TaskRequest;
import management.member.demo.dto.TaskResponse;
import management.member.demo.entity.Task;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toTask(TaskRequest request);

    TaskResponse toTaskResponse(Task task);
}
