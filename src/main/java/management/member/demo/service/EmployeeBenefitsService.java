package management.member.demo.service;

import management.member.demo.dto.AddBenefitForEmployeeRequestDTO;
import management.member.demo.dto.EmployeeBenefitResponseDTO;
import management.member.demo.dto.UpdateEmployeeBenefitRequestDTO;
import management.member.demo.entity.Benefits;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.EmployeeBenefitsMapper;
import management.member.demo.repository.EmployeeBenefitsRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service quản lý EmployeeBenefits (liên kết nhân viên với benefits)
 */
@Service
@Transactional
public class EmployeeBenefitsService {

    @Autowired
    private EmployeeBenefitsRepository employeeBenefitsRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BenefitsService benefitsService;

    @Autowired
    private EmployeeBenefitsMapper employeeBenefitsMapper;

    /**
     * Lấy tất cả benefits theo employeeId
     */
    public List<EmployeeBenefits> getAllBenefitsByEmployeeId(String employeeId) {
        // Tìm employee
        Employee employee = getEmployeeById(employeeId);
        
        // Tìm tất cả benefits của employee
        return employeeBenefitsRepository.findByEmployee(employee);
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
     * Thêm benefit cho employee theo employeeId
     */
    public EmployeeBenefits addBenefitForEmployeeById(
            String employeeId,
            AddBenefitForEmployeeRequestDTO request) {
        // Tìm employee
        Employee employee = getEmployeeById(employeeId);
        
        // Tìm benefit template
        Benefits benefit = benefitsService.getBenefitByBenefitId(request.getBenefitId());
        
        // Map từ DTO sang Entity
        EmployeeBenefits employeeBenefit = employeeBenefitsMapper.toEntity(
                request, employee, benefit);
        
        // Lưu lại
        return employeeBenefitsRepository.save(employeeBenefit);
    }

    /**
     * Cập nhật benefit theo employeeId và benefitId
     */
    public EmployeeBenefits updateBenefitByEmployeeId(
            String employeeId,
            String benefitId,
            UpdateEmployeeBenefitRequestDTO request) {
        // Tìm employee
        Employee employee = getEmployeeById(employeeId);
        
        // Tìm benefit template
        Benefits benefit = benefitsService.getBenefitByBenefitId(request.getBenefitId());
        
        // Tìm employee benefit
        List<EmployeeBenefits> employeeBenefits = 
                employeeBenefitsRepository.findByEmployeeAndBenefit(employee, benefit);
        
        EmployeeBenefits employeeBenefit = employeeBenefits.stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Employee Benefit", 
                    "employeeId và benefitId", 
                    employeeId + " - " + benefitId
                ));
        
        // Cập nhật các field từ request
        employeeBenefitsMapper.updateEntityFromRequest(employeeBenefit, request, benefit);
        
        // Lưu lại
        return employeeBenefitsRepository.save(employeeBenefit);
    }

    /**
     * Xóa benefit theo employeeId và benefitId
     */
    public void deleteBenefitByEmployeeId(String employeeId, String benefitId) {
        // Tìm employee
        Employee employee = getEmployeeById(employeeId);
        
        // Tìm benefit template
        Benefits benefit = benefitsService.getBenefitByBenefitId(benefitId);
        
        // Tìm employee benefit
        List<EmployeeBenefits> employeeBenefits = 
                employeeBenefitsRepository.findByEmployeeAndBenefit(employee, benefit);
        
        if (employeeBenefits.isEmpty()) {
            throw new ResourceNotFoundException(
                "Employee Benefit", 
                "employeeId và benefitId", 
                employeeId + " - " + benefitId
            );
        }
        
        // Xóa tất cả benefits tìm được
        employeeBenefitsRepository.deleteAll(employeeBenefits);
    }
}
