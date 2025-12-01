package management.member.demo.mapper;

import management.member.demo.dto.EmployeeBenefitsResponse;
import management.member.demo.entity.EmployeeBenefits;
import org.springframework.stereotype.Component;

// Mapper mapping giữa Entity và DTO
@Component
public class EmployeeBenefitsMapper {

    // Map entity sang response DTO
    public EmployeeBenefitsResponse toResponse(EmployeeBenefits employeeBenefits) {
        return EmployeeBenefitsResponse.builder()
                .benefitId(employeeBenefits.getBenefitId())
                .name(employeeBenefits.getName())
                .status(employeeBenefits.getStatus())
                .description(employeeBenefits.getDescription())
                .coverage(employeeBenefits.getCoverage())
                .monthlyCost(employeeBenefits.getMonthlyCost())
                .startDate(employeeBenefits.getStartDate())
                .endDate(employeeBenefits.getEndDate())
                .build();
    }
}

