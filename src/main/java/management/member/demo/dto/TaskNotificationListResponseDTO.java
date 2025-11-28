package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskNotificationListResponseDTO {
    private List<TaskNotificationDTO> data;
    private boolean success;
}

