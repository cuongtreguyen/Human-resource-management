package management.member.demo.Service;

import management.member.demo.Enum.EmployeeStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.Mapper.EmployeeMapper;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.EmployeeSearchFilterRequest;
import management.member.demo.dto.ProfileResponse;
import management.member.demo.dto.ProfileUpdateRequest;
import management.member.demo.entity.Employee;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.validator.EmployeeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

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
     * Chỉ cho phép update thông tin liên hệ (fullName, email, phone, address)
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
     * Lấy danh sách tất cả nhân viên
     * Bao gồm: Employee Name, Department, Position, Start Date, Monthly Salary, Status
     */
    public List<EmployeeResponse> getAllEmployees() {
        List<Employee> employees = repository.findAll();
        return employees.stream()
                .map(employeeMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Đếm tổng số lượng nhân viên
     */
    public Long getTotalEmployees() {
        return repository.count();
    }

    /**
     * Đếm số lượng nhân viên đang hoạt động (status = ACTIVE)
     */
    public Long getActiveEmployeesCount() {
        return repository.countByStatus(EmployeeStatus.ACTIVE);
    }

    /**
     * Tìm kiếm và lọc nhân viên theo các tiêu chí
     * Hỗ trợ filter theo: Department, Position, Salary Range
     */
    public List<EmployeeResponse> searchAndFilterEmployees(EmployeeSearchFilterRequest filterRequest) {
        List<Employee> employees;
        
        // Lấy tất cả employees nếu không có filter nào
        if (filterRequest == null || 
            (filterRequest.getDepartment() == null && 
             filterRequest.getPosition() == null && 
             filterRequest.getMinSalary() == null && 
             filterRequest.getMaxSalary() == null)) {
            employees = repository.findAll();
        } else {
            // Xử lý filter
            String department = filterRequest.getDepartment();
            String position = filterRequest.getPosition();
            Boolean allPositions = filterRequest.getAllPositions();
            BigDecimal minSalary = filterRequest.getMinSalary();
            BigDecimal maxSalary = filterRequest.getMaxSalary();
            
            // Nếu allPositions = true, bỏ qua filter position
            if (Boolean.TRUE.equals(allPositions)) {
                position = null;
            }
            
            // Xác định method query phù hợp
            if (department != null && position != null && minSalary != null && maxSalary != null) {
                // Filter theo department, position và salary range
                employees = repository.findByDepartmentAndPositionAndBaseSalaryBetween(
                        department, position, minSalary, maxSalary);
            } else if (department != null && position != null) {
                // Filter theo department và position
                employees = repository.findByDepartmentAndPosition(department, position);
            } else if (department != null && minSalary != null && maxSalary != null) {
                // Filter theo department và salary range
                employees = repository.findByDepartmentAndBaseSalaryBetween(
                        department, minSalary, maxSalary);
            } else if (position != null && minSalary != null && maxSalary != null) {
                // Filter theo position và salary range
                employees = repository.findByPositionAndBaseSalaryBetween(
                        position, minSalary, maxSalary);
            } else if (department != null) {
                // Filter theo department
                employees = repository.findByDepartment(department);
            } else if (position != null) {
                // Filter theo position
                employees = repository.findByPosition(position);
            } else if (minSalary != null && maxSalary != null) {
                // Filter theo salary range
                employees = repository.findByBaseSalaryBetween(minSalary, maxSalary);
            } else {
                // Không có filter hợp lệ, lấy tất cả
                employees = repository.findAll();
            }
        }
        
        // Map sang response
        return employees.stream()
                .map(employeeMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Xóa nhân viên theo ID
     */
    public void deleteEmployee(Long id) {
        employeeValidator.validateEmployeeId(id);
        
        // Kiểm tra employee tồn tại
        Employee employee = findEmployeeById(id);
        
        // Xóa employee
        repository.delete(employee);
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
