package management.member.demo.Mapper;

import management.member.demo.dto.AuditLogDTO;
import management.member.demo.entity.AuditLog;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho AuditLog
 */
@Component
public class AuditLogMapper {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

    public AuditLogDTO toDTO(AuditLog log) {
        AuditLogDTO dto = new AuditLogDTO();
        dto.setId(String.valueOf(log.getId()));
        dto.setTimestamp(log.getTimestamp() != null ? log.getTimestamp().format(ISO_FORMATTER) : null);
        dto.setUser(log.getUser());
        dto.setAction(log.getAction());
        dto.setResource(log.getResource());
        dto.setDetails(log.getDetails());
        dto.setIpAddress(log.getIpAddress());
        return dto;
    }
}

