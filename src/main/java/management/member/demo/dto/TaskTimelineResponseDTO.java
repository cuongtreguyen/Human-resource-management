package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskTimelineResponseDTO {
    private List<TaskTimelineEventDTO> data;
    private boolean success;
}

