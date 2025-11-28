package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CleanupLogsResponseDTO {
    private String message;
    private Integer deletedCount;
    private boolean success;
}

