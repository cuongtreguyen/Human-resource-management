package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTaskProgressResponseDTO {
    private String taskId;
    private String message;
    private boolean success;
}

