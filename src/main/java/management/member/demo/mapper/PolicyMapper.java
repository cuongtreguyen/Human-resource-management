package management.member.demo.mapper;

import management.member.demo.dto.PolicyDTO;
import management.member.demo.entity.Policy;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho Policy
 */
@Component
public class PolicyMapper {

    public PolicyDTO toDTO(Policy policy) {
        PolicyDTO dto = new PolicyDTO();
        dto.setId(String.valueOf(policy.getId()));
        dto.setName(policy.getName());
        dto.setDescription(policy.getDescription());
        dto.setType(policy.getType());
        dto.setStatus(policy.getStatus());
        dto.setEffectiveDate(policy.getEffectiveDate());
        return dto;
    }
}

