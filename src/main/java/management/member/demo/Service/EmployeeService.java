package management.member.demo.Service;

import management.member.demo.Enum.EmployeeStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.Mapper.EmployeeMapper;
import management.member.demo.dto.AddEmployeeRequest;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.EmployeeSearchFilterRequest;
import management.member.demo.dto.ProfileResponse;
import management.member.demo.dto.ProfileUpdateRequest;
import management.member.demo.entity.Employee;
import management.member.demo.entity.User;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.validator.EmployeeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
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
    private final AuthService authService;

    @Autowired
    public EmployeeService(EmployeeRepository repository, 
                          EmployeeMapper employeeMapper,
                          EmployeeValidator employeeValidator,
                          AuthService authService) {
        this.repository = repository;
        this.employeeMapper = employeeMapper;
        this.employeeValidator = employeeValidator;
        this.authService = authService;
    }

    /**
     * Thêm nhân viên mới
     */
    public EmployeeResponse addEmployee(AddEmployeeRequest request) {
        // Validate request
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
        
        // Kiểm tra email đã tồn tại chưa
        if (repository.existsByEmail(request.getEmail())) {
            throw ErrorCode.EMPLOYEE_EMAIL_EXISTS.toException();
        }
        
        // Tạo Employee entity từ request
        Employee employee = new Employee();
        
        // Parse name thành firstName và lastName
        String name = request.getName();
        if (name != null && !name.trim().isEmpty()) {
            String[] nameParts = name.trim().split("\\s+", 2);
            if (nameParts.length > 0) {
                employee.setFirstName(nameParts[0]);
                if (nameParts.length > 1) {
                    employee.setLastName(nameParts[1]);
                }
            }
            employee.setFullName(name.trim());
        }
        
        // Set các field cơ bản
        employee.setEmail(request.getEmail());
        employee.setPosition(request.getPosition());
        employee.setDepartment(request.getDepartment());
        employee.setPhone(request.getPhone());
        employee.setHireDate(request.getHireDate());
        employee.setBaseSalary(request.getSalary());
        
        // Convert status string sang enum
        String statusStr = request.getStatus();
        if (statusStr != null) {
            try {
                employee.setStatus(EmployeeStatus.valueOf(statusStr.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw ErrorCode.INVALID_STATUS_VALUE.toException();
            }
        } else {
            employee.setStatus(EmployeeStatus.ACTIVE); // Default
        }
        
        // Set các field bổ sung
        employee.setPersonalEmail(request.getPersonalEmail());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setGender(request.getGender());
        employee.setIdNumber(request.getIdNumber());
        employee.setTaxCode(request.getTaxCode());
        employee.setEmployeeId(request.getEmployeeId());
        employee.setContractCode(request.getContractCode());
        employee.setContractType(request.getContractType());
        employee.setPermanentAddress(request.getPermanentAddress());
        employee.setTemporaryAddress(request.getTemporaryAddress());
        
        // Generate employeeCode nếu chưa có
        if (request.getEmployeeId() != null && !request.getEmployeeId().trim().isEmpty()) {
            employee.setEmployeeCode(request.getEmployeeId());
        } else {
            // Generate employeeCode tự động
            String employeeCode = generateEmployeeCode();
            employee.setEmployeeCode(employeeCode);
        }
        
        // Set address (nếu có permanentAddress thì dùng, không thì dùng temporaryAddress)
        if (request.getPermanentAddress() != null && !request.getPermanentAddress().trim().isEmpty()) {
            employee.setAddress(request.getPermanentAddress());
        } else if (request.getTemporaryAddress() != null && !request.getTemporaryAddress().trim().isEmpty()) {
            employee.setAddress(request.getTemporaryAddress());
        }
        
        // Set default remainingLeaveDays
        employee.setRemainingLeaveDays(12);
        
        // Save employee
        Employee savedEmployee = repository.save(employee);
        return employeeMapper.toResponse(savedEmployee);
    }
    
    /**
     * Generate employee code tự động
     */
    private String generateEmployeeCode() {
        Long count = repository.count();
        return "EMP" + String.format("%05d", count + 1);
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

    // Lấy thông tin profile của nhân viên theo ID
    // Employee chỉ có thể xem profile của chính mình, Admin có thể xem tất cả
    public ProfileResponse getProfile(Long id) {
        employeeValidator.validateEmployeeId(id);
        
        Employee employee = findEmployeeById(id);
        
        // Kiểm tra quyền truy cập: Employee chỉ xem được profile của chính mình
        User currentUser = authService.getCurrentUser();
        if (currentUser != null && "EMPLOYEE".equals(currentUser.getRole().name())) {
            // Employee chỉ xem được profile của chính mình (so sánh qua email)
            if (!employee.getEmail().equals(currentUser.getEmail())) {
                throw new AccessDeniedException("Bạn không có quyền truy cập profile này");
            }
        }
        
        return employeeMapper.toProfileResponse(employee);
    }

    // Cập nhật profile của nhân viên theo ID
    // Employee chỉ có thể update profile của chính mình, Admin có thể update tất cả
    public ProfileResponse updateProfile(Long id, ProfileUpdateRequest request) {
        employeeValidator.validateEmployeeId(id);
        employeeValidator.validateProfileUpdateRequest(request);
        
        Employee employee = findEmployeeById(id);
        
        // Kiểm tra quyền truy cập: Employee chỉ update được profile của chính mình
        User currentUser = authService.getCurrentUser();
        if (currentUser != null && "EMPLOYEE".equals(currentUser.getRole().name())) {
            // Employee chỉ update được profile của chính mình (so sánh qua email)
            if (!employee.getEmail().equals(currentUser.getEmail())) {
                throw new AccessDeniedException("Bạn không có quyền cập nhật profile này");
            }
        }
        
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
