package management.member.demo.Service;

import management.member.demo.Mapper.EmployeeInsuranceContractMapper;
import management.member.demo.dto.EmployeeInsuranceContractResponse;
import management.member.demo.entity.EmployeeInsuranceContract;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeInsuranceContractRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Service xử lý quản lý employee insurance contracts
@Service
public class EmployeeInsuranceContractService {

    private final EmployeeInsuranceContractRepository employeeInsuranceContractRepository;
    private final EmployeeInsuranceContractMapper employeeInsuranceContractMapper;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeInsuranceContractService(EmployeeInsuranceContractRepository employeeInsuranceContractRepository,
                                            EmployeeInsuranceContractMapper employeeInsuranceContractMapper,
                                            EmployeeRepository employeeRepository) {
        this.employeeInsuranceContractRepository = employeeInsuranceContractRepository;
        this.employeeInsuranceContractMapper = employeeInsuranceContractMapper;
        this.employeeRepository = employeeRepository;
    }

    // Lấy tất cả employee insurance contracts
    public List<EmployeeInsuranceContractResponse> GetAllEmployeeInsuranceContracts() {
        List<EmployeeInsuranceContract> contracts = employeeInsuranceContractRepository.findAll();
        
        if (contracts.isEmpty()) {
            throw new ResourceNotFoundException(
                    ErrorCode.EMPLOYEE_BENEFITS_NOT_FOUND.getMessage());
        }
        
        return contracts.stream()
                .map(employeeInsuranceContractMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Đếm số lượng insurance contracts theo ID nhân viên
    public Long getTotalInsuranceContracts(Long employeeId) {
        // Validate employeeId
        if (employeeId == null) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException();
        }

        // Kiểm tra employee tồn tại
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        // Đếm số lượng insurance contracts của employee
        List<EmployeeInsuranceContract> contracts = employeeInsuranceContractRepository.findByEmployeeId(employeeId);
        return (long) contracts.size();
    }
}
