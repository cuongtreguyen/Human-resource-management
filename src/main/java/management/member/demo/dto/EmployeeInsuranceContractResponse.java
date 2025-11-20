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
public class EmployeeInsuranceContractResponse {
    private Long id;
    private Long employeeId;
    private String contractNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private String coverage;
    private String description;
}
