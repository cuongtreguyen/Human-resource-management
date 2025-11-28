package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarkNotificationReadResponseDTO {
    private String id;
    private Boolean read;
    private String message;
    private boolean success;
}

