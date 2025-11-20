package management.member.demo.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Data
@Getter
@Setter
@Builder
public class EmployeeBenefitsResponse {
    private String benefitId;    // NEW
    private String name;
    private String status;
    private String description;
    private String coverage;
    private String monthlyCost;
    private LocalDate startDate;
    private LocalDate endDate;
}
