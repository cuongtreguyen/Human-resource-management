package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoluntaryInsuranceDTO {
    private String id;
    private String name;
    private String provider;
    private Integer monthlyPremium;
    private String coverage;
    private String maxBenefit;
    private String status; // "available", "enrolled"
    private String description;
}

