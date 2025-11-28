package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendMessageResponseDTO {
    private Long id;
    private String senderId;
    private String receiverId;
    private String message;
    private String timestamp;
    private String type;
    private boolean success;
}

