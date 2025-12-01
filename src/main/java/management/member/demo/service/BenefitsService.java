package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.entity.EmployeeInsuranceContract;
import management.member.demo.entity.Employee;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.BenefitsMapper;
import management.member.demo.repository.EmployeeBenefitsRepository;
import management.member.demo.repository.EmployeeInsuranceContractRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BenefitsService {

    @Autowired
    private EmployeeBenefitsRepository benefitsRepository;

    @Autowired
    private EmployeeInsuranceContractRepository insuranceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BenefitsMapper benefitsMapper;

    public BenefitListResponseDTO getBenefits() {
        List<EmployeeBenefits> benefits = benefitsRepository.findAll();

        List<BenefitDTO> benefitDTOs = benefits.stream()
                .map(benefitsMapper::toBenefitDTO)
                .collect(Collectors.toList());

        BenefitListResponseDTO response = new BenefitListResponseDTO();
        response.setData(benefitDTOs);
        response.setSuccess(true);

        return response;
    }

    public EmployeeBenefitsDetailResponseDTO getEmployeeBenefits(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

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
                .mapToInt(b -> b.getMonthlyValue() != null ? b.getMonthlyValue() : 0)
                .sum();
        response.setTotalBenefitValue(totalValue);

        response.setSuccess(true);
        return response;
    }

    public CreateBenefitRequestResponseDTO createBenefitRequest(CreateBenefitRequestRequestDTO request) {
        Long employeeId = Long.parseLong(request.getEmployeeId());
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        // Create benefit request (mock - would need BenefitRequest entity)
        CreateBenefitRequestResponseDTO response = new CreateBenefitRequestResponseDTO();
        response.setId("REQ-" + System.currentTimeMillis());
        response.setEmployeeId(request.getEmployeeId());
        response.setStatus("pending");
        response.setSuccess(true);
        response.setMessage("Yêu cầu đã được gửi thành công! HR sẽ xử lý trong 1-3 ngày làm việc.");

        return response;
    }

    public ApproveBenefitRequestResponseDTO approveBenefitRequest(String id, ApproveBenefitRequestRequestDTO request) {
        ApproveBenefitRequestResponseDTO response = new ApproveBenefitRequestResponseDTO();
        response.setId(id);
        response.setStatus("approved");
        response.setSuccess(true);
        response.setMessage("Đã phê duyệt yêu cầu " + id);

        return response;
    }

    public RejectBenefitRequestResponseDTO rejectBenefitRequest(String id, RejectBenefitRequestRequestDTO request) {
        RejectBenefitRequestResponseDTO response = new RejectBenefitRequestResponseDTO();
        response.setData(new RejectBenefitRequestResponseDTO.BenefitRequestData());
        response.getData().setId(id);
        response.getData().setStatus("rejected");
        response.getData().setRejectedBy(request.getApproverName());
        response.getData().setRejectedDate(LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        response.getData().setRejectReason(request.getRejectReason());
        response.setSuccess(true);
        response.setMessage("Đã từ chối yêu cầu " + id);

        return response;
    }

    public WelfareProgramListResponseDTO getWelfarePrograms() {
        List<EmployeeBenefits> benefits = benefitsRepository.findAll();

        List<WelfareProgramDTO> programDTOs = benefits.stream()
                .map(benefitsMapper::toWelfareProgramDTO)
                .collect(Collectors.toList());

        WelfareProgramListResponseDTO response = new WelfareProgramListResponseDTO();
        response.setData(programDTOs);
        response.setSuccess(true);

        return response;
    }

    public InsurancePolicyListResponseDTO getInsurancePolicies() {
        List<EmployeeInsuranceContract> contracts = insuranceRepository.findAll();

        List<InsurancePolicyDTO> policyDTOs = contracts.stream()
                .map(benefitsMapper::toInsurancePolicyDTO)
                .distinct()
                .collect(Collectors.toList());

        InsurancePolicyListResponseDTO response = new InsurancePolicyListResponseDTO();
        response.setData(policyDTOs);
        response.setSuccess(true);

        return response;
    }

    public VoluntaryInsuranceListResponseDTO getVoluntaryInsurance() {
        List<EmployeeInsuranceContract> contracts = insuranceRepository.findAll();

        List<VoluntaryInsuranceDTO> insuranceDTOs = contracts.stream()
                .filter(ic -> ic.getCoverage() != null && !ic.getCoverage().contains("BHXH"))
                .map(benefitsMapper::toVoluntaryInsuranceDTO)
                .collect(Collectors.toList());

        VoluntaryInsuranceListResponseDTO response = new VoluntaryInsuranceListResponseDTO();
        response.setData(insuranceDTOs);
        response.setSuccess(true);

        return response;
    }

    public EmployeeInsuranceDetailResponseDTO getEmployeeInsuranceDetail(String employeeId) {
        Long empId = Long.parseLong(employeeId);
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        List<EmployeeInsuranceContract> contracts = insuranceRepository.findByEmployeeId(empId);

        EmployeeInsuranceDetailResponseDTO response = new EmployeeInsuranceDetailResponseDTO();

        List<EmployeeInsuranceDetailResponseDTO.InsuranceDetailItemDTO> insuranceItems = contracts.stream()
                .map(benefitsMapper::toInsuranceDetailItemDTO)
                .collect(Collectors.toList());
        response.setData(insuranceItems);

        response.setSuccess(true);
        return response;
    }

    public BenefitRequestListResponseDTO getBenefitRequests() {
        // Mock data - would need BenefitRequest entity
        BenefitRequestListResponseDTO response = new BenefitRequestListResponseDTO();
        response.setData(new ArrayList<>());
        response.setSuccess(true);
        return response;
    }

    public EnrollVoluntaryInsuranceResponseDTO enrollVoluntaryInsurance(EnrollVoluntaryInsuranceRequestDTO request) {
        Long employeeId = Long.parseLong(request.getEmployeeId());
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        EmployeeInsuranceContract contract = new EmployeeInsuranceContract();
        contract.setEmployeeId(employeeId);
        contract.setCoverage("Voluntary Insurance");
        contract.setStartDate(LocalDate.now());
        contract.setEndDate(LocalDate.now().plusYears(1));
        contract.setContractNumber("VI-" + employeeId + "-" + System.currentTimeMillis());

        EmployeeInsuranceContract saved = insuranceRepository.save(contract);

        EnrollVoluntaryInsuranceResponseDTO response = new EnrollVoluntaryInsuranceResponseDTO();
        EnrollVoluntaryInsuranceResponseDTO.EnrollData data = new EnrollVoluntaryInsuranceResponseDTO.EnrollData();
        data.setEmployeeId(request.getEmployeeId());
        data.setInsuranceId(request.getInsuranceId());
        data.setStatus("enrolled");
        data.setStartDate(LocalDate.now().toString());
        response.setData(data);
        response.setSuccess(true);
        response.setMessage("Đã đăng ký bảo hiểm tự nguyện thành công");

        return response;
    }
}

