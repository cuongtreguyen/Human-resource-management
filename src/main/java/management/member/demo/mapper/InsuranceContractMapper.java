package management.member.demo.mapper;

import management.member.demo.dto.CreateInsuranceContractRequestDTO;
import management.member.demo.dto.InsuranceContractResponseDTO;
import management.member.demo.dto.UpdateInsuranceContractRequestDTO;
import management.member.demo.entity.InsuranceContract;
import org.springframework.stereotype.Component;

/**
 * Mapper cho InsuranceContract (template contract)
 */
@Component
public class InsuranceContractMapper {

    /**
     * Map CreateInsuranceContractRequestDTO sang InsuranceContract entity
     */
    public InsuranceContract toEntity(CreateInsuranceContractRequestDTO request) {
        if (request == null) {
            return null;
        }
        
        InsuranceContract contract = new InsuranceContract();
        contract.setInsurenceName(request.getInsurenceName());
        contract.setEmployerRate(request.getEmployerRate());
        contract.setEmployeeRate(request.getEmployeeRate());
        contract.setProvider(request.getProvider() != null ? request.getProvider() : "");
        contract.setEffective(request.getEffective());
        contract.setExpiry(request.getExpiry());
        contract.setStatus(request.getStatus());
        return contract;
    }

    /**
     * Map InsuranceContract entity sang InsuranceContractResponseDTO
     */
    public InsuranceContractResponseDTO toResponseDTO(InsuranceContract contract) {
        if (contract == null) {
            return null;
        }
        
        InsuranceContractResponseDTO dto = new InsuranceContractResponseDTO();
        dto.setId(contract.getId());
        dto.setInsurenceName(contract.getInsurenceName());
        dto.setEmployerRate(contract.getEmployerRate());
        dto.setEmployeeRate(contract.getEmployeeRate());
        dto.setProvider(contract.getProvider());
        dto.setEffective(contract.getEffective());
        dto.setExpiry(contract.getExpiry());
        dto.setStatus(contract.getStatus());
        return dto;
    }

    /**
     * Map UpdateInsuranceContractRequestDTO sang InsuranceContract entity (update existing)
     */
    public void updateEntityFromRequest(InsuranceContract contract, UpdateInsuranceContractRequestDTO request) {
        if (contract == null || request == null) {
            return;
        }
        
        contract.setInsurenceName(request.getInsurenceName());
        contract.setEmployerRate(request.getEmployerRate());
        contract.setEmployeeRate(request.getEmployeeRate());
        if (request.getProvider() != null) {
            contract.setProvider(request.getProvider());
        }
        contract.setEffective(request.getEffective());
        contract.setExpiry(request.getExpiry());
        contract.setStatus(request.getStatus());
    }
}

