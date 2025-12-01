package management.member.demo.service;

import management.member.demo.dto.EmployeeInsuranceContractResponse;
import management.member.demo.entity.EmployeeInsuranceContract;
import management.member.demo.mapper.EmployeeInsuranceContractMapper;
import management.member.demo.repository.EmployeeInsuranceContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeInsuranceContractService {

    @Autowired
    private EmployeeInsuranceContractRepository insuranceRepository;

    @Autowired
    private EmployeeInsuranceContractMapper insuranceMapper;

    public List<EmployeeInsuranceContractResponse> GetAllEmployeeInsuranceContracts() {
        List<EmployeeInsuranceContract> contracts = insuranceRepository.findAll();
        return contracts.stream()
                .map(insuranceMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Long getTotalInsuranceContracts(Long employeeId) {
        return (long) insuranceRepository.findByEmployeeId(employeeId).size();
    }
}

