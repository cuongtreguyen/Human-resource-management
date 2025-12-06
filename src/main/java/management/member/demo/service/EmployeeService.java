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

    @Autowired
    private EmailService emailService;

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
        // Password: fullname (không dấu, lowercase, remove spaces) + "123"
        String defaultPassword = null;
        if (!userRepository.existsByEmail(saved.getEmail())) {
            User user = new User();
            user.setEmail(saved.getEmail()); // Email generated từ fullName
            user.setFullName(saved.getFullName()); // Lưu fullName từ Employee
            user.setEmployeeId(saved.getEmployeeId()); // Lưu employeeId từ Employee
            user.setRole(Role.EMPLOYEE);
            String passwordBase = generateEmailFromFullName(saved.getFullName()).replace("@company.com", "");
            defaultPassword = passwordBase + "123"; // Lưu password trước khi encode để gửi email
            user.setPassword(passwordEncoder.encode(defaultPassword));
            user.setIsActive(true);
            user.setIsLocked(false);
            user.setEmployee(saved); // Link với Employee
            userRepository.save(user);
            
            // Gửi email thông tin đăng nhập về personalEmail
            if (saved.getPersonalEmail() != null && !saved.getPersonalEmail().trim().isEmpty()) {
                try {
                    emailService.sendEmployeeCredentials(
                        saved.getPersonalEmail(),  // Gửi về personalEmail
                        saved.getFullName(),       // Full name
                        saved.getEmail(),          // Email đăng nhập (từ User)
                        defaultPassword,           // Password (chưa encode)
                        saved.getEmployeeId()      // Employee ID
                    );
                } catch (Exception e) {
                    // Log lỗi nhưng không fail việc tạo employee
                    // Email sẽ được in ra console nếu không gửi được
                    System.err.println("Failed to send credentials email to " + saved.getPersonalEmail() + ": " + e.getMessage());
                }
            }
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

        // Partial update: Chỉ update các field được gửi trong request
        // Các field không được gửi hoặc null sẽ giữ nguyên giá trị cũ
        // Helper method để kiểm tra giá trị có phải placeholder từ Swagger không
        // Swagger UI tự động điền "string" vào các field, cần bỏ qua những giá trị này
        java.util.function.Predicate<String> isValidValue = value -> 
            value != null && !value.trim().isEmpty() && !value.trim().equalsIgnoreCase("string");
        
        // Helper method để kiểm tra date có phải giá trị mặc định từ Swagger không
        // Swagger UI tự động điền ngày hiện tại vào các field date, cần bỏ qua nếu là ngày hôm nay
        java.util.function.Predicate<LocalDate> isValidDate = date -> 
            date != null && !date.equals(LocalDate.now());
        
        // Update basic fields: chỉ update nếu có giá trị hợp lệ (không phải null, empty string, hoặc placeholder "string")
        if (isValidValue.test(request.getName())) {
            employee.setFullName(request.getName().trim());
        }
        if (isValidValue.test(request.getFirstName())) {
            employee.setFirstName(request.getFirstName().trim());
        }
        if (isValidValue.test(request.getLastName())) {
            employee.setLastName(request.getLastName().trim());
        }
        if (isValidValue.test(request.getPhone())) {
            employee.setPhone(request.getPhone().trim());
        }
        if (isValidValue.test(request.getPosition())) {
            employee.setPosition(request.getPosition().trim());
        }
        if (isValidValue.test(request.getDepartment())) {
            employee.setDepartment(request.getDepartment().trim());
        }
        // Update email: chỉ update nếu email mới khác email hiện tại và không phải placeholder "string"
        if (isValidValue.test(request.getEmail())) {
            String newEmail = request.getEmail().trim();
            if (!newEmail.equals(employee.getEmail())) {
                if (employeeRepository.existsByEmail(newEmail)) {
                    throw new IllegalArgumentException("Email already exists: " + newEmail);
                }
                employee.setEmail(newEmail);
            }
        }
        // Update personalEmail: chỉ update nếu có giá trị hợp lệ (không phải placeholder "string")
        if (isValidValue.test(request.getPersonalEmail())) {
            employee.setPersonalEmail(request.getPersonalEmail().trim());
        }
        // Update dateOfBirth: chỉ update nếu có giá trị và không phải ngày hiện tại (placeholder từ Swagger)
        if (isValidDate.test(request.getDateOfBirth())) {
            employee.setDateOfBirth(request.getDateOfBirth());
        }
        if (isValidValue.test(request.getGender())) {
            employee.setGender(request.getGender().trim());
        }
        if (isValidValue.test(request.getEmployeeId())) {
            employee.setEmployeeId(request.getEmployeeId().trim());
        }
        if (isValidValue.test(request.getIdNumber())) {
            employee.setIdCard(request.getIdNumber().trim());
        }
        if (isValidValue.test(request.getTaxCode())) {
            employee.setTaxCode(request.getTaxCode().trim());
        }
        if (isValidValue.test(request.getContractCode())) {
            employee.setContractCode(request.getContractCode().trim());
        }
        if (isValidValue.test(request.getContractType())) {
            employee.setContractType(request.getContractType().trim());
        }
        if (isValidValue.test(request.getPermanentAddress())) {
            employee.setPermanentAddress(request.getPermanentAddress().trim());
        }
        if (isValidValue.test(request.getTemporaryAddress())) {
            employee.setTemporaryAddress(request.getTemporaryAddress().trim());
        }
        // Update idCardIssueDate: chỉ update nếu có giá trị và không phải ngày hiện tại (placeholder từ Swagger)
        if (isValidDate.test(request.getIdCardIssueDate())) {
            employee.setIdCardIssueDate(request.getIdCardIssueDate());
        }
        if (isValidValue.test(request.getIdCardIssuePlace())) {
            employee.setIdCardIssuePlace(request.getIdCardIssuePlace().trim());
        }
        if (isValidValue.test(request.getMaritalStatus())) {
            employee.setMaritalStatus(request.getMaritalStatus().trim());
        }
        // Update employeeType: chỉ update nếu có giá trị hợp lệ (không phải placeholder "string")
        if (request.getEmployeeType() != null && !request.getEmployeeType().trim().equalsIgnoreCase("string")) {
            try {
                employee.setEmployeeType(EmployeeType.valueOf(request.getEmployeeType().toUpperCase()));
            } catch (IllegalArgumentException ignored) {
                // Ignore if invalid enum value
            }
        }
        if (isValidValue.test(request.getEmergencyContactName())) {
            employee.setEmergencyContactName(request.getEmergencyContactName().trim());
        }
        if (isValidValue.test(request.getEmergencyContactPhone())) {
            employee.setEmergencyContactPhone(request.getEmergencyContactPhone().trim());
        }
        if (isValidValue.test(request.getEmergencyContactRelationship())) {
            employee.setEmergencyContactRelationship(request.getEmergencyContactRelationship().trim());
        }
        if (request.getTimeIn() != null) {
            employee.setTimeIn(request.getTimeIn());
        }
        if (request.getTimeOut() != null) {
            employee.setTimeOut(request.getTimeOut());
        }
        if (isValidValue.test(request.getShift())) {
            employee.setShift(request.getShift().trim());
        }
        if (isValidValue.test(request.getWorkLocation())) {
            employee.setWorkLocation(request.getWorkLocation().trim());
        }
        // Update startDate (hireDate): chỉ update nếu có giá trị và không phải ngày hiện tại (placeholder từ Swagger)
        if (isValidDate.test(request.getStartDate())) {
            employee.setHireDate(request.getStartDate());
        }
        // Update status: chỉ update nếu có giá trị hợp lệ (không phải placeholder "string")
        if (request.getStatus() != null && !request.getStatus().trim().equalsIgnoreCase("string")) {
            try {
                employee.setStatus(EmployeeStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + request.getStatus());
            }
        }
        if (request.getSalary() != null) {
            employee.setBaseSalary(request.getSalary());
        }
        if (isValidValue.test(request.getAddress())) {
            employee.setAddress(request.getAddress().trim());
        }
        if (isValidValue.test(request.getManager())) {
            employee.setManager(request.getManager().trim());
        }
        // Update role: chỉ update nếu có giá trị hợp lệ (không phải placeholder "string")
        if (request.getRole() != null && !request.getRole().trim().equalsIgnoreCase("string")) {
            try {
                Role newRole = Role.valueOf(request.getRole().toUpperCase());
                employee.setRole(newRole);
                
                // Cập nhật role trong bảng User nếu employee có user liên kết
                if (employee.getUser() != null) {
                    User user = employee.getUser();
                    user.setRole(newRole);
                    userRepository.save(user);
                }
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid role: " + request.getRole());
            }
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
        // Chỉ tìm theo employeeId (String), ví dụ: EMP001, EMP002
        Optional<Employee> employee = employeeRepository.findByEmployeeId(id);
        if (employee.isPresent()) {
            return employee.get();
        }

        // Không tìm thấy employee với employeeId này
        throw new ResourceNotFoundException(
                ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với employeeId: " + id);
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

