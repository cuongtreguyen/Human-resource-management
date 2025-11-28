package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditLogDTO {
    private String id; // Log ID as string
    private String timestamp; // ISO format: "2024-01-15T10:30:00Z"
    private String user;
    private String action;
    private String resource;
    private String details;
    private String ipAddress;
}

