package management.member.demo.Service;

import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.entity.Employee;
import management.member.demo.repository.ManageEmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import management.member.demo.exception.ResourceNotFoundException;
import management.member.demo.exception.BusinessException;
import management.member.demo.entity.User;
import management.member.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
public class ManageEmployeeService {

	private final ManageEmployeeRepository repository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final EmailService emailService;

	@Autowired
	public ManageEmployeeService(ManageEmployeeRepository repository, UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
		this.repository = repository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.emailService = emailService;
	}

    @Autowired
    private ModelMapper mapper;

    public EmployeeResponse create(EmployeeRequest request) {
        // Validate email không được trùng
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BusinessException("EMAIL_REQUIRED", "Email is required");
        }
        if (repository.existsByEmail(request.getEmail())) {
            throw new BusinessException("EMPLOYEE_EMAIL_EXISTS", "Employee email already exists");
        }
        
        // Tạo employeeId tự động theo format EMP + số tăng dần
        String employeeId = generateEmployeeId();
        
        // Tách fullName thành firstName và lastName
        String[] nameParts = request.getFullName().split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";
        
        // Tạo mật khẩu mặc định
        String defaultPassword = generateDefaultPassword();
        
        // Tạo User trực tiếp
        User user = new User();
        user.setUsername(request.getEmail());
        user.setPassword(passwordEncoder.encode(defaultPassword));
        user.setEmail(request.getEmail());
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setIsActive(true);
        user.setIsLocked(false);
        user.setFailedLoginAttempts(0);
        user.setLastLogin(null);
        userRepository.save(user);
        
        // Tạo Employee
        Employee e = mapper.map(request, Employee.class);
        e.setEmployeeId(employeeId);
        e = repository.save(e);
        
        // Gửi email thông tin tài khoản cho nhân viên
        try {
            emailService.sendEmployeeCredentials(
                request.getEmail(), 
                request.getFullName(), 
                request.getEmail(), 
                defaultPassword, 
                employeeId
            );
        } catch (Exception ex) {
            // Log lỗi nhưng không fail toàn bộ process
            System.err.println("Failed to send email via AWS SES: " + ex.getMessage());
        }
        
        EmployeeResponse response = mapper.map(e, EmployeeResponse.class);
        return response;
    }
    
    // Tạo employeeId tự động theo format EMP001, EMP002, ...
    private String generateEmployeeId() {
        long count = repository.count();
        return String.format("EMP%03d", count + 1);
    }
    
    // Tạo mật khẩu mặc định cho nhân viên
    private String generateDefaultPassword() {
        return "Employee@123"; // Mật khẩu mặc định, nhân viên sẽ đổi sau
    }

    public List<EmployeeResponse> informationEmployee() {
        return repository.findAll().stream()
                .map(e -> mapper.map(e, EmployeeResponse.class))
                .collect(Collectors.toList());
    }

    public EmployeeResponse findEmployeeById(Long id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapper.map(employee, EmployeeResponse.class);
    }

    // Kiểm tra nhân viên có khớp với các tiêu chí tìm kiếm không
    private boolean matchesCriteria(Employee emp, String fullName, String email, String phoneNumber,
                                    String address, String department, String position,
                                    BigDecimal salary, String skill, String certificate, String status) {
        return matchesString(fullName, emp.getFullName()) && matchesString(email, emp.getEmail()) &&
                matchesString(phoneNumber, emp.getPhoneNumber()) && matchesString(address, emp.getAddress()) &&
                matchesString(department, emp.getDepartment()) && matchesString(position, emp.getPosition()) &&
                (salary == null || (emp.getSalary() != null && emp.getSalary().equals(salary))) &&
                matchesString(skill, emp.getSkill()) && matchesString(certificate, emp.getCertificate()) &&
                matchesString(status, emp.getStatus());
    }

    // Kiểm tra chuỗi tìm kiếm có chứa trong giá trị field không (không phân biệt hoa thường)
    private boolean matchesString(String searchTerm, String fieldValue) {
        return searchTerm == null || (fieldValue != null && fieldValue.toLowerCase().contains(searchTerm.toLowerCase()));
    }

    /**
     * Tìm kiếm nhân viên theo nhiều tiêu chí
     */
    public List<EmployeeResponse> searchEmployees(String fullName, String email, String phoneNumber, 
                                                  String address, String department, String position, 
                                                  BigDecimal salary, String skill, String certificate, 
                                                  String status) {
        // Validate ít nhất một tiêu chí tìm kiếm
        if (fullName == null && email == null && phoneNumber == null && address == null && 
            department == null && position == null && salary == null && skill == null && 
            certificate == null && status == null) {
            throw new BusinessException("SEARCH_CRITERIA_REQUIRED", "At least one search criteria is required");
        }

        List<Employee> employees = repository.findAll().stream()
                .filter(emp -> matchesCriteria(emp, fullName, email, phoneNumber, address, 
                                             department, position, salary, skill, certificate, status))
                .collect(Collectors.toList());

        if (employees.isEmpty()) {
            throw new ResourceNotFoundException("No employees found matching the search criteria");
        }

        return employees.stream()
                .map(e -> mapper.map(e, EmployeeResponse.class))
                .collect(Collectors.toList());
    }
}
