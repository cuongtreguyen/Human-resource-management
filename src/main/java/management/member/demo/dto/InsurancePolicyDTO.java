package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InsurancePolicyDTO {
    private String id;
    private String name;
    private String provider;
    private String employerRate;
    private String employeeRate;
    private String effective;
    private String expiry;
    private String type; // "mandatory", "voluntary"
    private String description;
}

