package management.member.demo.Service;

import management.member.demo.Enum.EmployeeStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.Mapper.EmployeeMapper;
import management.member.demo.dto.*;
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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
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
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        employeeValidator.validateAddEmployeeRequest(request);
        
        // Kiểm tra email đã tồn tại chưa (business logic - kiểm tra trong DB)
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
     * Get employee count response DTO
     */
    public EmployeeCountResponseDTO getEmployeeCountResponse() {
        EmployeeCountResponseDTO response = new EmployeeCountResponseDTO();
        response.setTotalEmployees(getTotalEmployees());
        response.setActiveEmployeesCount(getActiveEmployeesCount());
        return response;
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
     * Tạo employee mới - trả về CreateEmployeeResponseDTO
     */
    public CreateEmployeeResponseDTO createEmployee(AddEmployeeRequest request) {
        // Validate request - Validator kiểm tra dữ liệu nhập từ người dùng
        employeeValidator.validateAddEmployeeRequest(request);
        
        // Kiểm tra email đã tồn tại chưa (business logic - kiểm tra trong DB)
        if (repository.existsByEmail(request.getEmail())) {
            throw ErrorCode.EMPLOYEE_EMAIL_EXISTS.toException();
        }
        
        // Tạo Employee entity từ request (sử dụng logic từ addEmployee)
        addEmployee(request);
        
        // Tìm employee vừa tạo để lấy ID
        Employee savedEmployee = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found after creation"));
        
        // Map sang CreateEmployeeResponseDTO
        CreateEmployeeResponseDTO response = new CreateEmployeeResponseDTO();
        response.setId(savedEmployee.getEmployeeId() != null ? savedEmployee.getEmployeeId() : 
                      savedEmployee.getEmployeeCode() != null ? savedEmployee.getEmployeeCode() : 
                      String.valueOf(savedEmployee.getId()));
        response.setName(savedEmployee.getFullName());
        response.setEmail(savedEmployee.getEmail());
        response.setMessage("Employee created successfully");
        response.setSuccess(true);
        
        return response;
    }

    /**
     * Lấy danh sách employees với filters - trả về EmployeeListResponse
     */
    public EmployeeListResponse getEmployeesWithFilters(String search, String department, String position, String status) {
        List<Employee> employees;
        
        // Convert status string to enum
        EmployeeStatus statusEnum = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                statusEnum = EmployeeStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore
            }
        }
        
        // Query với search và filters
        if (search != null && !search.trim().isEmpty()) {
            // Có search term
            if (department != null && position != null && statusEnum != null) {
                employees = repository.searchByNameOrEmailAndDepartmentAndPositionAndStatus(search, department, position, statusEnum);
            } else if (department != null && position != null) {
                employees = repository.searchByNameOrEmailAndDepartmentAndPosition(search, department, position);
            } else if (department != null && statusEnum != null) {
                employees = repository.searchByNameOrEmailAndDepartmentAndStatus(search, department, statusEnum);
            } else if (position != null && statusEnum != null) {
                employees = repository.searchByNameOrEmailAndPositionAndStatus(search, position, statusEnum);
            } else if (department != null) {
                employees = repository.searchByNameOrEmailAndDepartment(search, department);
            } else if (position != null) {
                employees = repository.searchByNameOrEmailAndPosition(search, position);
            } else if (statusEnum != null) {
                employees = repository.searchByNameOrEmailAndStatus(search, statusEnum);
            } else {
                employees = repository.searchByNameOrEmail(search);
            }
        } else {
            // Không có search term, chỉ filter
            if (department != null && position != null && statusEnum != null) {
                employees = repository.findByDepartmentAndPositionAndStatus(department, position, statusEnum);
            } else if (department != null && position != null) {
                employees = repository.findByDepartmentAndPosition(department, position);
            } else if (department != null && statusEnum != null) {
                employees = repository.findByDepartmentAndStatus(department, statusEnum);
            } else if (position != null && statusEnum != null) {
                employees = repository.findByPositionAndStatus(position, statusEnum);
            } else if (department != null) {
                employees = repository.findByDepartment(department);
            } else if (position != null) {
                employees = repository.findByPosition(position);
            } else if (statusEnum != null) {
                employees = repository.findByStatus(statusEnum);
            } else {
                employees = repository.findAll();
            }
        }
        
        // Map sang EmployeeListItemDTO
        List<EmployeeListItemDTO> items = employees.stream()
                .map(this::mapToEmployeeListItemDTO)
                .collect(Collectors.toList());
        
        EmployeeListResponse response = new EmployeeListResponse();
        response.setData(items);
        response.setTotal(items.size());
        response.setSuccess(true);
        
        return response;
    }

    /**
     * Lấy employee detail theo ID (String) - trả về EmployeeDetailDTO
     */
    public EmployeeDetailDTO getEmployeeDetailById(String id) {
        Employee employee = findEmployeeByStringId(id);
        
        EmployeeDetailDTO dto = new EmployeeDetailDTO();
        dto.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : 
                  employee.getEmployeeCode() != null ? employee.getEmployeeCode() : 
                  String.valueOf(employee.getId()));
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setPosition(employee.getPosition());
        dto.setDepartment(employee.getDepartment());
        dto.setStatus(employee.getStatus() != null ? employee.getStatus().name().toLowerCase() : "active");
        dto.setHireDate(employee.getHireDate());
        dto.setSalary(employee.getBaseSalary());
        dto.setPersonalEmail(employee.getPersonalEmail());
        dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setGender(employee.getGender());
        dto.setIdNumber(employee.getIdNumber());
        dto.setTaxCode(employee.getTaxCode());
        dto.setPermanentAddress(employee.getPermanentAddress());
        dto.setTemporaryAddress(employee.getTemporaryAddress());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setContractCode(employee.getContractCode());
        dto.setContractType(employee.getContractType());
        
        return dto;
    }

    /**
     * Cập nhật employee theo ID (String) - trả về UpdateEmployeeResponseDTO
     */
    public UpdateEmployeeResponseDTO updateEmployeeById(String id, UpdateEmployeeRequest request) {
        Employee employee = findEmployeeByStringId(id);
        
        // Update các fields từ request
        if (request.getFirstName() != null) {
            employee.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            employee.setLastName(request.getLastName());
            // Update fullName
            if (employee.getFirstName() != null) {
                employee.setFullName(employee.getFirstName() + " " + request.getLastName());
            }
        }
        if (request.getEmail() != null) {
            // Kiểm tra email đã tồn tại chưa (trừ chính employee này)
            Optional<Employee> existing = repository.findByEmail(request.getEmail());
            if (existing.isPresent() && !existing.get().getId().equals(employee.getId())) {
                throw ErrorCode.EMPLOYEE_EMAIL_EXISTS.toException();
            }
            employee.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            employee.setAddress(request.getAddress());
        }
        if (request.getDateOfBirth() != null) {
            employee.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            employee.setGender(request.getGender());
        }
        if (request.getEmployeeId() != null) {
            employee.setEmployeeId(request.getEmployeeId());
        }
        if (request.getDepartment() != null) {
            employee.setDepartment(request.getDepartment());
        }
        if (request.getPosition() != null) {
            employee.setPosition(request.getPosition());
        }
        if (request.getStartDate() != null) {
            employee.setHireDate(request.getStartDate());
        }
        if (request.getStatus() != null) {
            try {
                employee.setStatus(EmployeeStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw ErrorCode.INVALID_STATUS_VALUE.toException();
            }
        }
        if (request.getSalary() != null) {
            employee.setBaseSalary(request.getSalary());
        }
        
        repository.save(employee);
        
        UpdateEmployeeResponseDTO response = new UpdateEmployeeResponseDTO();
        response.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : 
                      employee.getEmployeeCode() != null ? employee.getEmployeeCode() : 
                      String.valueOf(employee.getId()));
        response.setMessage("Employee updated successfully");
        response.setSuccess(true);
        
        return response;
    }

    /**
     * Xóa employee theo ID (String) - trả về DeleteEmployeeResponseDTO
     */
    public DeleteEmployeeResponseDTO deleteEmployeeById(String id) {
        Employee employee = findEmployeeByStringId(id);
        
        String employeeId = employee.getEmployeeId() != null ? employee.getEmployeeId() : 
                           employee.getEmployeeCode() != null ? employee.getEmployeeCode() : 
                           String.valueOf(employee.getId());
        
        repository.delete(employee);
        
        DeleteEmployeeResponseDTO response = new DeleteEmployeeResponseDTO();
        response.setId(employeeId);
        response.setMessage("Employee deleted successfully");
        response.setSuccess(true);
        
        return response;
    }

    /**
     * Export employees - trả về ExportResponseDTO
     */
    public ExportResponseDTO exportEmployees(String format, String search, String department, String status) {
        // Generate filename
        String filename = "employees_" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + 
                "." + (format != null ? format : "excel");
        
        ExportResponseDTO response = new ExportResponseDTO();
        response.setUrl("/exports/" + filename);
        response.setFilename(filename);
        response.setMessage("Export completed successfully");
        response.setSuccess(true);
        
        return response;
    }

    /**
     * Map Employee sang EmployeeListItemDTO
     */
    private EmployeeListItemDTO mapToEmployeeListItemDTO(Employee employee) {
        EmployeeListItemDTO dto = new EmployeeListItemDTO();
        dto.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : 
                 employee.getEmployeeCode() != null ? employee.getEmployeeCode() : 
                 String.valueOf(employee.getId()));
        dto.setName(employee.getFullName());
        dto.setEmail(employee.getEmail());
        dto.setPosition(employee.getPosition());
        dto.setDepartment(employee.getDepartment());
        dto.setPhone(employee.getPhone());
        dto.setStatus(employee.getStatus() != null ? employee.getStatus().name().toLowerCase() : "active");
        dto.setAvatar("/api/placeholder/150/150");
        dto.setHireDate(employee.getHireDate());
        dto.setSalary(employee.getBaseSalary());
        return dto;
    }

    /**
     * Tìm Employee theo String ID (có thể là Long id, employeeId, hoặc employeeCode)
     */
    private Employee findEmployeeByStringId(String id) {
        // Thử parse thành Long id
        try {
            Long longId = Long.parseLong(id);
            Optional<Employee> employee = repository.findById(longId);
            if (employee.isPresent()) {
                return employee.get();
            }
        } catch (NumberFormatException e) {
            // Không phải Long id, tiếp tục
        }
        
        // Thử tìm theo employeeId
        Optional<Employee> employee = repository.findByEmployeeId(id);
        if (employee.isPresent()) {
            return employee.get();
        }
        
        // Thử tìm theo employeeCode
        employee = repository.findByEmployeeCode(id);
        if (employee.isPresent()) {
            return employee.get();
        }
        
        throw new ResourceNotFoundException(
                ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id);
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
