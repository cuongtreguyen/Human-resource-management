package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskTimelineResponseDTO {
    private Integer year;
    private Integer month;
    private List<TaskTimelineEventDTO> events;
    private boolean success;
}

