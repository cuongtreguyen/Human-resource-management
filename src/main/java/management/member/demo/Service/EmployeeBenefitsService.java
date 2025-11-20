package management.member.demo.Service;

import management.member.demo.Mapper.EmployeeBenefitsMapper;
import management.member.demo.dto.EmployeeBenefitsResponse;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeBenefitsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import management.member.demo.repository.EmployeeRepository;
import java.util.List;
import java.util.stream.Collectors;

// Service xử lý quản lý employee benefits
@Service
public class EmployeeBenefitsService {

    private final EmployeeBenefitsRepository employeeBenefitsRepository;
    private final EmployeeBenefitsMapper employeeBenefitsMapper;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeBenefitsService(EmployeeBenefitsRepository employeeBenefitsRepository,
                                   EmployeeBenefitsMapper employeeBenefitsMapper,
                                   EmployeeRepository employeeRepository) {
        this.employeeBenefitsRepository = employeeBenefitsRepository;
        this.employeeBenefitsMapper = employeeBenefitsMapper;
        this.employeeRepository = employeeRepository;
    }

    // Lấy tất cả employee benefits
    public List<EmployeeBenefitsResponse> GetAllEmployeeBenefits() {
        List<EmployeeBenefits> benefits = employeeBenefitsRepository.findAll();
        
        if (benefits.isEmpty()) {
            throw new ResourceNotFoundException(
                    ErrorCode.EMPLOYEE_BENEFITS_NOT_FOUND.getMessage());
        }
        
        return benefits.stream()
                .map(employeeBenefitsMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Đếm số lượng benefits theo ID nhân viên
    public Long getTotalBenefits(Long employeeId) {
        // Validate employeeId
        if (employeeId == null) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException();
        }

        // Kiểm tra employee tồn tại
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        // Đếm số lượng benefits của employee
        List<EmployeeBenefits> benefits = employeeBenefitsRepository.findByEmployeeId(employeeId);
        return (long) benefits.size();
    }
}
