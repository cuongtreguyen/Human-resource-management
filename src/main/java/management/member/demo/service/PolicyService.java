package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Policy;
import management.member.demo.mapper.PolicyMapper;
import management.member.demo.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private PolicyMapper policyMapper;

    public PolicyListResponseDTO getAllPolicies() {
        List<Policy> policies = policyRepository.findAll();

        List<PolicyDTO> policyDTOs = policies.stream()
                .map(policyMapper::toDTO)
                .collect(Collectors.toList());

        PolicyListResponseDTO response = new PolicyListResponseDTO();
        response.setData(policyDTOs);
        response.setSuccess(true);

        return response;
    }

    public CreatePolicyResponseDTO createPolicy(CreatePolicyRequestDTO request) {
        Policy policy = new Policy();
        policy.setName(request.getName());
        policy.setDescription(request.getDescription());
        policy.setType(request.getType());
        policy.setEffectiveDate(request.getEffectiveDate());
        policy.setStatus("active");

        Policy saved = policyRepository.save(policy);

        CreatePolicyResponseDTO response = new CreatePolicyResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setSuccess(true);
        response.setMessage("Policy created successfully");

        return response;
    }
}

