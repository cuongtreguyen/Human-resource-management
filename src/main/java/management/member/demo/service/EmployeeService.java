package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.User;
import management.member.demo.enums.EmployeeStatus;
import management.member.demo.enums.EmployeeType;
import management.member.demo.enums.Role;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.EmployeeMapper;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeMapper employeeMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public CreateEmployeeResponseDTO createEmployee(AddEmployeeRequest request) {
        // Generate email từ fullName: fullname (không dấu, lowercase, remove spaces) + @company.com
        String generatedEmail = generateEmailFromFullName(request.getName());
        
        // Check if email already exists
        if (employeeRepository.existsByEmail(generatedEmail)) {
            throw new IllegalArgumentException("Email already exists: " + generatedEmail);
        }

        Employee employee = new Employee();
        // Set các field cơ bản
        employee.setFullName(request.getName());
        employee.setFirstName(request.getName() != null && request.getName().contains(" ") 
                ? request.getName().split(" ")[0] : request.getName());
        employee.setLastName(request.getName() != null && request.getName().contains(" ") 
                ? request.getName().substring(request.getName().indexOf(" ") + 1) : "");
        employee.setEmail(generatedEmail); // Email generated từ fullName
        employee.setPersonalEmail(request.getPersonalEmail()); // Email cá nhân
        employee.setPhone(request.getPhone());
        employee.setGender(request.getGender());
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setDepartment(request.getDepartment());
        employee.setPosition(request.getPosition());
        employee.setEmployeeId(request.getEmployeeId());
        employee.setRole(Role.EMPLOYEE);

        // Set các field bổ sung
        employee.setIdCardIssueDate(request.getIdCardIssueDate());
        employee.setIdCardIssuePlace(request.getIdCardIssuePlace());
        employee.setMaritalStatus(request.getMaritalStatus());
        employee.setTaxCode(request.getTaxCode());
        employee.setContractCode(request.getContractCode());
        // EmployeeType enum
        if (request.getEmployeeType() != null) {
            try {
                employee.setEmployeeType(EmployeeType.valueOf(request.getEmployeeType().toUpperCase()));
            } catch (IllegalArgumentException ignored) {
                // Nếu sai enum → bỏ qua
            }
        }
        employee.setEmergencyContactName(request.getEmergencyContactName());
        employee.setEmergencyContactPhone(request.getEmergencyContactPhone());
        employee.setEmergencyContactRelationship(request.getEmergencyContactRelationship());
        employee.setTimeOut(request.getTimeOut());
        employee.setTimeIn(request.getTimeIn());
        employee.setShift(request.getShift());
        employee.setPermanentAddress(request.getPermanentAddress());
        employee.setTemporaryAddress(request.getTemporaryAddress());
        employee.setWorkLocation(request.getWorkLocation());
        
        // Set các field khác
        employee.setHireDate(request.getHireDate());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setBaseSalary(request.getSalary());
        if (request.getIdNumber() != null) {
            employee.setIdCard(request.getIdNumber());
        }

        Employee saved = employeeRepository.save(employee);

        // Tự động tạo User cho Employee
        // Email: fullname + @company.com (đã generate ở trên)
        // Password: fullname + "123"
        if (!userRepository.existsByEmail(saved.getEmail())) {
            User user = new User();
            user.setEmail(saved.getEmail()); // Email generated từ fullName
            user.setFullName(saved.getFullName()); // Lưu fullName từ Employee
            user.setEmployeeId(saved.getEmployeeId()); // Lưu employeeId từ Employee
            user.setRole(Role.EMPLOYEE);
            // Password: fullname + "123"
            String defaultPassword = saved.getFullName() + "123";
            user.setPassword(passwordEncoder.encode(defaultPassword));
            user.setIsActive(true);
            user.setIsLocked(false);
            user.setEmployee(saved); // Link với Employee
            userRepository.save(user);
        }

        CreateEmployeeResponseDTO response = new CreateEmployeeResponseDTO();
        response.setData(new CreateEmployeeResponseDTO.EmployeeData());
        response.getData().setId(saved.getEmployeeId() != null ? saved.getEmployeeId() : String.valueOf(saved.getId()));
        response.getData().setName(saved.getFullName());
        response.getData().setStatus(saved.getStatus().name().toLowerCase());
        response.setSuccess(true);
        response.setMessage("Employee created successfully");

        return response;
    }

    /**
     * Generate email từ fullName: fullname (không dấu, lowercase, remove spaces) + @company.com
     * Ví dụ: "Nguyễn Văn A" -> "nguyenvana@company.com"
     */
    private String generateEmailFromFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Full name cannot be empty");
        }
        
        // Remove Vietnamese accents
        String normalized = Normalizer.normalize(fullName, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String withoutAccents = pattern.matcher(normalized).replaceAll("");
        
        // Convert to lowercase, remove spaces, keep only letters and numbers
        String emailPart = withoutAccents.toLowerCase()
                .replaceAll("[^a-z0-9]", "")
                .trim();
        
        return emailPart + "@company.com";
    }

    public EmployeeListResponse getEmployeesWithFilters(String search, String department, String position, String status) {
        List<Employee> employees;

        EmployeeStatus statusEnum = null;
        if (status != null && !status.isEmpty()) {
            try {
                statusEnum = EmployeeStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore filter
            }
        }

        if (search != null && !search.isEmpty()) {
            if (department != null && position != null && statusEnum != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartmentAndPositionAndStatus(search, department, position, statusEnum);
            } else if (department != null && statusEnum != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartmentAndStatus(search, department, statusEnum);
            } else if (position != null && statusEnum != null) {
                employees = employeeRepository.searchByNameOrEmailAndPositionAndStatus(search, position, statusEnum);
            } else if (department != null && position != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartmentAndPosition(search, department, position);
            } else if (department != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartment(search, department);
            } else if (position != null) {
                employees = employeeRepository.searchByNameOrEmailAndPosition(search, position);
            } else if (statusEnum != null) {
                employees = employeeRepository.searchByNameOrEmailAndStatus(search, statusEnum);
            } else {
                employees = employeeRepository.searchByNameOrEmail(search);
            }
        } else {
            if (department != null && position != null && statusEnum != null) {
                employees = employeeRepository.findByDepartmentAndPositionAndStatus(department, position, statusEnum);
            } else if (department != null && statusEnum != null) {
                employees = employeeRepository.findByDepartmentAndStatus(department, statusEnum);
            } else if (position != null && statusEnum != null) {
                employees = employeeRepository.findByPositionAndStatus(position, statusEnum);
            } else if (department != null && position != null) {
                employees = employeeRepository.findByDepartmentAndPosition(department, position);
            } else if (department != null) {
                employees = employeeRepository.findByDepartment(department);
            } else if (position != null) {
                employees = employeeRepository.findByPosition(position);
            } else if (statusEnum != null) {
                employees = employeeRepository.findByStatus(statusEnum);
            } else {
                employees = employeeRepository.findAll();
            }
        }

        List<EmployeeListItemDTO> employeeDTOs = employees.stream()
                .map(employeeMapper::toListItemDTO)
                .collect(Collectors.toList());

        EmployeeListResponse response = new EmployeeListResponse();
        response.setData(employeeDTOs);
        response.setSuccess(true);
        response.setTotal(employeeDTOs.size());

        return response;
    }

    public Long getTotalEmployees() {
        return employeeRepository.count();
    }

    public Long getActiveEmployeesCount() {
        return employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
    }

    /**
     * Lấy thống kê tổng số nhân viên và số nhân viên đang hoạt động
     * 
     * @return Map chứa totalEmployees và activeEmployees
     */
    public Map<String, Long> getEmployeeStats() {
        Long total = getTotalEmployees();
        Long active = getActiveEmployeesCount();
        return Map.of(
            "totalEmployees", total,
            "activeEmployees", active
        );
    }

    public EmployeeDetailDTO getEmployeeDetailById(String id) {
        Employee employee = findEmployeeById(id);
        return employeeMapper.toDetailDTO(employee);
    }

    public UpdateEmployeeResponseDTO updateEmployeeById(String id, UpdateEmployeeRequest request) {
        Employee employee = findEmployeeById(id);

        if (request.getName() != null) {
            employee.setFullName(request.getName());
        }
        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        if (request.getPosition() != null) {
            employee.setPosition(request.getPosition());
        }
        if (request.getDepartment() != null) {
            employee.setDepartment(request.getDepartment());
        }
        if (request.getEmail() != null && !request.getEmail().equals(employee.getEmail())) {
            if (employeeRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists: " + request.getEmail());
            }
            employee.setEmail(request.getEmail());
        }

        Employee updated = employeeRepository.save(employee);

        UpdateEmployeeResponseDTO response = new UpdateEmployeeResponseDTO();
        response.setData(new UpdateEmployeeResponseDTO.EmployeeData());
        response.getData().setId(updated.getEmployeeId() != null ? updated.getEmployeeId() : String.valueOf(updated.getId()));
        response.getData().setName(updated.getFullName());
        response.setSuccess(true);
        response.setMessage("Employee updated successfully");

        return response;
    }

    public ProfileResponse getProfile(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id));
        return employeeMapper.toProfileResponse(employee);
    }

    public ProfileResponse updateProfile(Long id, ProfileUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id));

        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        // TODO: Add personalEmail field to UpdateEmployeeRequest if needed
        // if (request.getPersonalEmail() != null) {
        //     employee.setPersonalEmail(request.getPersonalEmail());
        // }
        if (request.getAddress() != null) {
            employee.setAddress(request.getAddress());
        }

        Employee updated = employeeRepository.save(employee);
        return employeeMapper.toProfileResponse(updated);
    }

    public DeleteEmployeeResponseDTO deleteEmployeeById(String id) {
        Employee employee = findEmployeeById(id);
        employeeRepository.delete(employee);

        DeleteEmployeeResponseDTO response = new DeleteEmployeeResponseDTO();
        response.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : String.valueOf(employee.getId()));
        response.setSuccess(true);
        response.setMessage("Employee deleted successfully");

        return response;
    }

    /**
     * Lấy danh sách nhân viên cho Accountant với đầy đủ filter
     * Hỗ trợ: search (name/email), department, position, minSalary, maxSalary
     */
    public EmployeeListResponse getEmployeesForAccountant(String search, String department, String position, BigDecimal minSalary, BigDecimal maxSalary) {
        List<Employee> employees;

        // Xử lý filter theo salary
        boolean hasSalaryFilter = minSalary != null || maxSalary != null;

        if (search != null && !search.isEmpty()) {
            // Có search: query theo search trước, sau đó filter theo salary bằng stream
            if (department != null && position != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartmentAndPosition(search, department, position);
            } else if (department != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartment(search, department);
            } else if (position != null) {
                employees = employeeRepository.searchByNameOrEmailAndPosition(search, position);
            } else {
                employees = employeeRepository.searchByNameOrEmail(search);
            }
        } else {
            // Không có search: có thể dùng repository method với salary
            if (hasSalaryFilter) {
                if (department != null && position != null) {
                    employees = employeeRepository.findByDepartmentAndPositionAndBaseSalaryBetween(department, position, 
                            minSalary != null ? minSalary : BigDecimal.ZERO, 
                            maxSalary != null ? maxSalary : new BigDecimal("999999999999"));
                } else if (department != null) {
                    employees = employeeRepository.findByDepartmentAndBaseSalaryBetween(department, 
                            minSalary != null ? minSalary : BigDecimal.ZERO, 
                            maxSalary != null ? maxSalary : new BigDecimal("999999999999"));
                } else if (position != null) {
                    employees = employeeRepository.findByPositionAndBaseSalaryBetween(position, 
                            minSalary != null ? minSalary : BigDecimal.ZERO, 
                            maxSalary != null ? maxSalary : new BigDecimal("999999999999"));
                } else {
                    employees = employeeRepository.findByBaseSalaryBetween(
                            minSalary != null ? minSalary : BigDecimal.ZERO, 
                            maxSalary != null ? maxSalary : new BigDecimal("999999999999"));
                }
            } else {
                // Không có salary filter
                if (department != null && position != null) {
                    employees = employeeRepository.findByDepartmentAndPosition(department, position);
                } else if (department != null) {
                    employees = employeeRepository.findByDepartment(department);
                } else if (position != null) {
                    employees = employeeRepository.findByPosition(position);
                } else {
                    employees = employeeRepository.findAll();
                }
            }
        }

        // Filter theo salary nếu có search (vì repository method không hỗ trợ search + salary)
        if (hasSalaryFilter && (search != null && !search.isEmpty())) {
            final BigDecimal finalMinSalary = minSalary;
            final BigDecimal finalMaxSalary = maxSalary;
            employees = employees.stream()
                    .filter(e -> {
                        BigDecimal salary = e.getBaseSalary() != null ? e.getBaseSalary() : BigDecimal.ZERO;
                        boolean minOk = finalMinSalary == null || salary.compareTo(finalMinSalary) >= 0;
                        boolean maxOk = finalMaxSalary == null || salary.compareTo(finalMaxSalary) <= 0;
                        return minOk && maxOk;
                    })
                    .collect(Collectors.toList());
        }

        List<EmployeeListItemDTO> employeeDTOs = employees.stream()
                .map(employeeMapper::toListItemDTO)
                .collect(Collectors.toList());

        EmployeeListResponse response = new EmployeeListResponse();
        response.setData(employeeDTOs);
        response.setSuccess(true);
        response.setTotal(employeeDTOs.size());

        return response;
    }


    private Employee findEmployeeById(String id) {
        // Try to parse as Long
        try {
            Long longId = Long.parseLong(id);
            Optional<Employee> employee = employeeRepository.findById(longId);
            if (employee.isPresent()) {
                return employee.get();
            }
        } catch (NumberFormatException e) {
            // Not a Long, try as employeeId or employeeCode
        }

        // Try as employeeId
        Optional<Employee> employee = employeeRepository.findByEmployeeId(id);
        if (employee.isPresent()) {
            return employee.get();
        }

        // Employee entity không có employeeCode nữa, chỉ tìm theo employeeId hoặc Long id
        throw new ResourceNotFoundException(
                ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id);
    }

    public java.util.Map<String, String> seniority(String employeeID) {
        Employee employee = employeeRepository.findByEmployeeId(employeeID)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeID));

        java.time.LocalDate hireDate = employee.getHireDate();

        if (hireDate == null) {
            throw new IllegalArgumentException("Hire date is null");
        } else if (hireDate.isAfter(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("Hire date is in the future");
        }

        java.time.LocalDate currentDate = java.time.LocalDate.now();
        java.time.Period period = java.time.Period.between(hireDate, currentDate);

        int years = period.getYears();
        int months = period.getMonths();

        String seniorityString = "";

        if (years > 0) {
            seniorityString += years + " năm";
        }
        if (months > 0) {
            if (years > 0) {
                seniorityString += " ";
            }
            seniorityString += months + " tháng";
        }

        if (seniorityString.isEmpty()) {
            seniorityString = "Dưới 1 tháng";
        }

        java.util.Map<String, String> responseBody = new java.util.HashMap<>();
        responseBody.put("seniority", seniorityString);

        return responseBody;
    }
}

