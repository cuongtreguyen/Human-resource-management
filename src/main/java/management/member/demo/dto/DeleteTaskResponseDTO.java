package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteTaskResponseDTO {
    private TaskData data;
    private String message;
    private boolean success;

    @Getter
    @Setter
    public static class TaskData {
        private Long id;
    }
}

