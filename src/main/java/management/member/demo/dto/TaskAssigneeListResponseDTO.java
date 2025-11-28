package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskAssigneeListResponseDTO {
    private List<TaskAssigneeDTO> data;
    private boolean success;
}

