package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BenefitRequestListItemDTO {
    private String id;
    private String employeeId;
    private String employee;
    private String department;
    private String type;
    private String typeLabel;
    private String submitted;
    private String reason;
    private Integer attachments;
    private String status;
    private String priority;
}

