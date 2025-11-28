package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTaskResponseDTO {
    private String id;
    private String message;
    private boolean success;
}

