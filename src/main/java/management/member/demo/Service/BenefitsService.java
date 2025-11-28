package management.member.demo.Service;

import management.member.demo.dto.*;
import management.member.demo.Mapper.BenefitsMapper;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.entity.EmployeeInsuranceContract;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeBenefitsRepository;
import management.member.demo.repository.EmployeeInsuranceContractRepository;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.validator.BenefitsValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BenefitsService {

    @Autowired
    private EmployeeBenefitsRepository benefitsRepository;

    @Autowired
    private EmployeeInsuranceContractRepository insuranceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BenefitsMapper benefitsMapper;

    @Autowired
    private BenefitsValidator benefitsValidator;

    public BenefitListResponseDTO getBenefits() {
        List<EmployeeBenefits> allBenefits = benefitsRepository.findAll();
        
        BenefitListResponseDTO response = new BenefitListResponseDTO();
        response.setData(allBenefits.stream()
                .map(benefitsMapper::toBenefitDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public EmployeeBenefitsDetailResponseDTO getEmployeeBenefits(String employeeId) {
        benefitsValidator.validateEmployeeIdString(employeeId); // Validate trước khi parse
        Long empId = Long.parseLong(employeeId);
        employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        List<EmployeeBenefits> benefits = benefitsRepository.findByEmployeeId(empId);
        List<EmployeeInsuranceContract> insuranceContracts = insuranceRepository.findByEmployeeId(empId);

        EmployeeBenefitsDetailResponseDTO response = new EmployeeBenefitsDetailResponseDTO();
        
        // Map benefits
        List<EmployeeBenefitsDetailResponseDTO.BenefitItemDTO> benefitItems = benefits.stream()
                .map(benefitsMapper::toBenefitItemDTO)
                .collect(Collectors.toList());
        response.setBenefits(benefitItems);

        // Map mandatory insurance
        List<EmployeeBenefitsDetailResponseDTO.InsuranceDetailDTO> mandatoryInsurance = insuranceContracts.stream()
                .filter(ic -> ic.getCoverage() != null && ic.getCoverage().contains("BHXH"))
                .map(benefitsMapper::toInsuranceDetailDTO)
                .collect(Collectors.toList());
        response.setMandatoryInsurance(mandatoryInsurance);

        // Map voluntary insurance
        List<EmployeeBenefitsDetailResponseDTO.InsuranceDetailDTO> voluntaryInsurance = insuranceContracts.stream()
                .filter(ic -> ic.getCoverage() != null && !ic.getCoverage().contains("BHXH"))
                .map(benefitsMapper::toInsuranceDetailDTO)
                .collect(Collectors.toList());
        response.setVoluntaryInsurance(voluntaryInsurance);

        // Calculate total benefit value
        int totalValue = benefitItems.stream()
                .mapToInt(item -> item.getMonthlyValue() != null ? item.getMonthlyValue() : 0)
                .sum();
        response.setTotalBenefitValue(totalValue);
        response.setSuccess(true);

        return response;
    }

    public CreateBenefitRequestResponseDTO createBenefitRequest(CreateBenefitRequestRequestDTO request) {
        // TODO: Implement actual benefit request creation
        CreateBenefitRequestResponseDTO response = new CreateBenefitRequestResponseDTO();
        response.setId("REQ-" + System.currentTimeMillis());
        response.setEmployeeId(request.getEmployeeId());
        response.setStatus("pending");
        response.setMessage("Benefit request created successfully");
        response.setSuccess(true);
        
        return response;
    }

    public ApproveBenefitRequestResponseDTO approveBenefitRequest(String id, ApproveBenefitRequestRequestDTO request) {
        // TODO: Implement actual benefit request approval
        ApproveBenefitRequestResponseDTO response = new ApproveBenefitRequestResponseDTO();
        response.setId(id);
        response.setStatus("approved");
        response.setMessage("Benefit request approved successfully");
        response.setSuccess(true);
        
        return response;
    }

    public WelfareProgramListResponseDTO getWelfarePrograms() {
        // TODO: Get from actual welfare programs table or EmployeeBenefits
        List<EmployeeBenefits> benefits = benefitsRepository.findAll();
        
        WelfareProgramListResponseDTO response = new WelfareProgramListResponseDTO();
        response.setData(benefits.stream()
                .filter(b -> b.getName() != null && (b.getName().contains("Phụ cấp") || b.getName().contains("welfare")))
                .map(benefitsMapper::toWelfareProgramDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public InsurancePolicyListResponseDTO getInsurancePolicies() {
        List<EmployeeInsuranceContract> contracts = insuranceRepository.findAll();
        
        InsurancePolicyListResponseDTO response = new InsurancePolicyListResponseDTO();
        response.setData(contracts.stream()
                .map(benefitsMapper::toInsurancePolicyDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public VoluntaryInsuranceListResponseDTO getVoluntaryInsurance() {
        List<EmployeeInsuranceContract> contracts = insuranceRepository.findAll();
        
        VoluntaryInsuranceListResponseDTO response = new VoluntaryInsuranceListResponseDTO();
        response.setData(contracts.stream()
                .filter(ic -> ic.getCoverage() != null && !ic.getCoverage().contains("BHXH") && !ic.getCoverage().contains("BHYT"))
                .map(benefitsMapper::toVoluntaryInsuranceDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public EmployeeInsuranceDetailResponseDTO getEmployeeInsuranceDetail(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        List<EmployeeInsuranceContract> contracts = insuranceRepository.findByEmployeeId(empId);
        
        EmployeeInsuranceDetailResponseDTO response = new EmployeeInsuranceDetailResponseDTO();
        response.setData(contracts.stream()
                .map(benefitsMapper::toInsuranceDetailItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

}

