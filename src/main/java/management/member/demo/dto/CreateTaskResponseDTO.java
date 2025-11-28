package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTaskResponseDTO {
    private String id;
    private String title;
    private String message;
    private boolean success;
}

