package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditLogStatsDTO {
    private Integer total;
    private Integer view;
    private Integer navigate;
    private Integer update;
    private Integer create;
    private Integer delete;
    private Integer error;
    private Integer attendance;
}

