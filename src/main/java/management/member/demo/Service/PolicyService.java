package management.member.demo.Service;

import management.member.demo.dto.*;
import management.member.demo.Mapper.PolicyMapper;
import management.member.demo.entity.Policy;
import management.member.demo.repository.PolicyRepository;
import management.member.demo.validator.PolicyValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private PolicyMapper policyMapper;

    @Autowired
    private PolicyValidator policyValidator;

    public PolicyListResponseDTO getAllPolicies() {
        List<Policy> policies = policyRepository.findAll();
        
        PolicyListResponseDTO response = new PolicyListResponseDTO();
        response.setData(policies.stream()
                .map(policyMapper::toDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public CreatePolicyResponseDTO createPolicy(CreatePolicyRequestDTO request) {
        policyValidator.validateCreatePolicyRequest(request); // Validate request
        Policy policy = new Policy();
        policy.setName(request.getName());
        policy.setDescription(request.getDescription());
        policy.setType(request.getType());
        policy.setStatus("active");
        policy.setEffectiveDate(request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now());

        Policy savedPolicy = policyRepository.save(policy);

        CreatePolicyResponseDTO response = new CreatePolicyResponseDTO();
        response.setId(String.valueOf(savedPolicy.getId()));
        response.setSuccess(true);
        response.setMessage("Policy created successfully");

        return response;
    }

}

