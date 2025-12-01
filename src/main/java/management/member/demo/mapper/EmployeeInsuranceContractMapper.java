package management.member.demo.mapper;

import management.member.demo.dto.EmployeeInsuranceContractResponse;
import management.member.demo.entity.EmployeeInsuranceContract;
import org.springframework.stereotype.Component;

// Mapper mapping giữa Entity và DTO
@Component
public class EmployeeInsuranceContractMapper {

    // Map entity sang response DTO
    public EmployeeInsuranceContractResponse toResponse(EmployeeInsuranceContract contract) {
        return EmployeeInsuranceContractResponse.builder()
                .id(contract.getId())
                .employeeId(contract.getEmployeeId())
                .contractNumber(contract.getContractNumber())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .coverage(contract.getCoverage())
                .description(contract.getDescription())
                .build();
    }
}

