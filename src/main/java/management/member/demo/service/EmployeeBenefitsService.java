package management.member.demo.service;

import management.member.demo.dto.EmployeeBenefitsResponse;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.mapper.EmployeeBenefitsMapper;
import management.member.demo.repository.EmployeeBenefitsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeBenefitsService {

    @Autowired
    private EmployeeBenefitsRepository benefitsRepository;

    @Autowired
    private EmployeeBenefitsMapper benefitsMapper;

    public List<EmployeeBenefitsResponse> GetAllEmployeeBenefits() {
        List<EmployeeBenefits> benefits = benefitsRepository.findAll();
        return benefits.stream()
                .map(benefitsMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Long getTotalBenefits(Long employeeId) {
        return (long) benefitsRepository.findByEmployeeId(employeeId).size();
    }
}

