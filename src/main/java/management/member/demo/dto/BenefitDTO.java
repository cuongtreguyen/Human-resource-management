package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BenefitDTO {
    private String id;
    private String name;
    private String nameLatin;
    private String type; // "insurance", "welfare", etc.
    private String description;
    private String coverage;
    private String eligibility;
    private String cost;
    private String status; // "active", "inactive"
    private Integer enrolledCount;
}

