package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateApplicationStatusResponseDTO {
    private String id;
    private String status;
    private String message;
    private boolean success;
}

