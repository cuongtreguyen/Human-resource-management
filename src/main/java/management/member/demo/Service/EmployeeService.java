package management.member.demo.Service;

import management.member.demo.exception.model.ErrorCode;
import management.member.demo.Mapper.EmployeeMapper;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.ProfileResponse;
import management.member.demo.dto.ProfileUpdateRequest;
import management.member.demo.entity.Employee;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.validator.EmployeeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class - Chỉ chịu trách nhiệm business logic của Employee
 */
@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final EmployeeMapper employeeMapper;
    private final EmployeeValidator employeeValidator;

    @Autowired
    public EmployeeService(EmployeeRepository repository, 
                          EmployeeMapper employeeMapper,
                          EmployeeValidator employeeValidator) {
        this.repository = repository;
        this.employeeMapper = employeeMapper;
        this.employeeValidator = employeeValidator;
    }

    /**
     * Lấy thông tin nhân viên theo ID
     */
    public EmployeeResponse getEmployeeById(Long id) {
        employeeValidator.validateEmployeeId(id);
        
        Employee employee = findEmployeeById(id);
        
        return employeeMapper.toResponse(employee);
    }

    /**
     * Cập nhật thông tin nhân viên
     */
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        employeeValidator.validateEmployeeId(id);
        employeeValidator.validateEmployeeRequest(request);
        
        Employee employee = findEmployeeById(id);
        
        employeeMapper.updateEmployeeFromRequest(employee, request);
        
        Employee savedEmployee = repository.save(employee);
        return employeeMapper.toResponse(savedEmployee);
    }

    /**
     * Lấy thông tin profile của nhân viên theo ID
     * Profile bao gồm thông tin liên hệ và thông tin công việc
     */
    public ProfileResponse getProfile(Long id) {
        employeeValidator.validateEmployeeId(id);
        
        Employee employee = findEmployeeById(id);
        
        return employeeMapper.toProfileResponse(employee);
    }

    /**
     * Cập nhật profile của nhân viên theo ID
     * Chỉ cho phép update thông tin liên hệ (firstName, lastName, email, phone, address)
     */
    public ProfileResponse updateProfile(Long id, ProfileUpdateRequest request) {
        employeeValidator.validateEmployeeId(id);
        employeeValidator.validateProfileUpdateRequest(request);
        
        Employee employee = findEmployeeById(id);
        
        employeeMapper.updateProfileFromRequest(employee, request);
        
        Employee savedEmployee = repository.save(employee);
        return employeeMapper.toProfileResponse(savedEmployee);
    }

    /**
     * Tìm Employee theo ID, throw exception nếu không tìm thấy
     */
    private Employee findEmployeeById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id));
    }
}
