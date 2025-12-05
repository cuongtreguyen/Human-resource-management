package management.member.demo.service;

import management.member.demo.dto.AddInsuranceContractForEmployeeRequestDTO;
import management.member.demo.dto.UpdateInsuranceContractByEmployeeRequestDTO;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeInsuranceContract;
import management.member.demo.entity.InsuranceContract;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.EmployeeInsuranceContractMapper;
import management.member.demo.repository.EmployeeInsuranceContractRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service quản lý EmployeeInsuranceContract (liên kết nhân viên với contracts)
 */
@Service
@Transactional
public class EmployeeInsuranceContractService {

    @Autowired
    private EmployeeInsuranceContractRepository employeeInsuranceContractRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private InsuranceContractService insuranceContractService;

    @Autowired
    private EmployeeInsuranceContractMapper employeeInsuranceContractMapper;

    /**
     * Lấy tất cả insurance contracts theo employeeId
     */
    public List<EmployeeInsuranceContract> getAllInsuranceContractsByEmployeeId(String employeeId) {
        // Tìm employee
        Employee employee = getEmployeeById(employeeId);
        
        // Tìm tất cả contracts của employee
        return employeeInsuranceContractRepository.findByEmployee(employee);
    }

    /**
     * Lấy employee theo employeeId (String hoặc Long)
     */
    public Employee getEmployeeById(String employeeId) {
        Optional<Employee> empByEmployeeId = employeeRepository.findByEmployeeId(employeeId);
        if (empByEmployeeId.isPresent()) {
            return empByEmployeeId.get();
        }
        
        try {
            Long empId = Long.parseLong(employeeId);
            Optional<Employee> empById = employeeRepository.findById(empId);
            if (empById.isPresent()) {
                return empById.get();
            }
        } catch (NumberFormatException e) {
            // Không parse được
        }
        
        throw new ResourceNotFoundException(
            "Employee", "employeeId", employeeId
        );
    }

    /**
     * Thêm insurance contract cho employee theo employeeId
     */
    public EmployeeInsuranceContract addInsuranceContractForEmployeeById(
            String employeeId,
            AddInsuranceContractForEmployeeRequestDTO request) {
        // Tìm employee
        Employee employee = getEmployeeById(employeeId);
        
        // Tìm contract template
        InsuranceContract contract = insuranceContractService.getInsuranceContractById(request.getContractId());
        
        // Map từ DTO sang Entity
        EmployeeInsuranceContract employeeContract = employeeInsuranceContractMapper.toEntity(
                request, employee, contract);
        
        // Lưu lại
        return employeeInsuranceContractRepository.save(employeeContract);
    }

    /**
     * Cập nhật insurance contract theo employeeId và contractId
     */
    public EmployeeInsuranceContract updateInsuranceContractByEmployeeId(
            String employeeId,
            Long contractId,
            UpdateInsuranceContractByEmployeeRequestDTO request) {
        // Tìm employee
        Employee employee = getEmployeeById(employeeId);
        
        // Tìm contract template
        InsuranceContract contract = insuranceContractService.getInsuranceContractById(request.getContractId());
        
        // Tìm employee contract
        List<EmployeeInsuranceContract> employeeContracts = 
                employeeInsuranceContractRepository.findByEmployeeAndContract(employee, contract);
        
        EmployeeInsuranceContract employeeContract = employeeContracts.stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Employee Insurance Contract", 
                    "employeeId và contractId", 
                    employeeId + " - " + contractId
                ));
        
        // Cập nhật các field từ request
        employeeInsuranceContractMapper.updateEntityFromRequest(employeeContract, request, contract);
        
        // Lưu lại
        return employeeInsuranceContractRepository.save(employeeContract);
    }

    /**
     * Xóa insurance contract theo employeeId và contractId
     */
    public void deleteInsuranceContractByEmployeeId(String employeeId, Long contractId) {
        // Tìm employee
        Employee employee = getEmployeeById(employeeId);
        
        // Tìm contract template
        InsuranceContract contract = insuranceContractService.getInsuranceContractById(contractId);
        
        // Tìm employee contract
        List<EmployeeInsuranceContract> employeeContracts = 
                employeeInsuranceContractRepository.findByEmployeeAndContract(employee, contract);
        
        if (employeeContracts.isEmpty()) {
            throw new ResourceNotFoundException(
                "Employee Insurance Contract", 
                "employeeId và contractId", 
                employeeId + " - " + contractId
            );
        }
        
        // Xóa tất cả contracts tìm được
        employeeInsuranceContractRepository.deleteAll(employeeContracts);
    }
}
