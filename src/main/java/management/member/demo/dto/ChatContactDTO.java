package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatContactDTO {
    private String id;
    private String name;
    private String avatar;
    private String email;
    private String position;
    private String department;
    private String lastMessage;
    private Integer unreadCount;
    private String lastSeen;
    private String status; // "online", "offline", "away"
}

