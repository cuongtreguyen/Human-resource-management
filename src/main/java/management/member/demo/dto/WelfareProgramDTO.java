package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WelfareProgramDTO {
    private String id;
    private String name;
    private String amount;
    private Integer monthlyValue;
    private Integer budget;
    private Integer participants;
    private String owner;
    private String status;
    private String description;
    private String eligibility;
}

