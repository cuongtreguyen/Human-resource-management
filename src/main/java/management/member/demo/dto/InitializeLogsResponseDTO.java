package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InitializeLogsResponseDTO {
    private String message;
    private Integer count;
    private boolean success;
}

