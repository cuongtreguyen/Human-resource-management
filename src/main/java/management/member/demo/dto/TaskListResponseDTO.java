package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskListResponseDTO {
    private List<TaskListItemDTO> data;
    private boolean success;
}

