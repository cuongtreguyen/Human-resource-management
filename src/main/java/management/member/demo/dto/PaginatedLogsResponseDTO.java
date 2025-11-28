package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PaginatedLogsResponseDTO {
    private List<AuditLogDTO> logs;
    private Long total;
    private Integer page;
    private Integer size;
    private Integer totalPages;
}

