package management.member.demo.validator;

import management.member.demo.enums.EmployeeStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.dto.AddEmployeeRequest;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.ProfileUpdateRequest;
import management.member.demo.entity.Employee;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.regex.Pattern;

/**
 * Validator class - Chỉ chịu trách nhiệm validate Employee data
 * Không chứa business logic hay logic lưu trữ
 */
@Component
public class EmployeeValidator {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );
    
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[0-9]{10,11}$" // Số điện thoại Việt Nam: 10-11 chữ số
    );

    /**
     * Validate Employee ID
     */
    public void validateEmployeeId(Long id) {
        if (id == null) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException();
        }
    }

    /**
     * Validate Employee entity không null
     */
    public void validateEmployee(Employee employee) {
        if (employee == null) {
            throw ErrorCode.INVALID_EMPLOYEE.toException();
        }
    }

    /**
     * Validate EmployeeRequest không null
     */
    public void validateRequest(EmployeeRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
    }

    /**
     * Validate tất cả các trường trong EmployeeRequest
     */
    public void validateEmployeeRequest(EmployeeRequest request) {
        validateRequest(request);
        validateFullName(request.getFullName());
        validateEmail(request.getEmail());
        validateEmployeeCode(request.getEmployeeCode());
        validateDepartment(request.getDepartment());
        validatePosition(request.getPosition());
        validateHireDate(request.getHireDate());
        validateStatus(String.valueOf(request.getStatus()));
        validateBaseSalary(request.getBaseSalary());
    }

    /**
     * Validate fullName
     */
    public void validateFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            throw ErrorCode.INVALID_FULL_NAME.toException();
        }
    }

    /**
     * Validate email - kiểm tra null, empty và format
     */
    public void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw ErrorCode.INVALID_EMAIL.toException();
        }
        String trimmedEmail = email.trim();
        if (!EMAIL_PATTERN.matcher(trimmedEmail).matches()) {
            throw ErrorCode.INVALID_EMAIL_FORMAT.toException();
        }
    }
    
    /**
     * Validate phone - kiểm tra format (10-11 chữ số)
     */
    public void validatePhone(String phone) {
        if (phone != null && !phone.trim().isEmpty()) {
            String trimmedPhone = phone.trim().replaceAll("[^0-9]", ""); // Loại bỏ ký tự không phải số
            if (!PHONE_PATTERN.matcher(trimmedPhone).matches()) {
                throw ErrorCode.INVALID_PHONE_FORMAT.toException();
            }
        }
    }
    
    /**
     * Validate dateOfBirth - không được trong tương lai
     */
    public void validateDateOfBirth(LocalDate dateOfBirth) {
        if (dateOfBirth != null && dateOfBirth.isAfter(LocalDate.now())) {
            throw ErrorCode.INVALID_DATE_OF_BIRTH.toException("Ngày sinh không được trong tương lai");
        }
    }
    
    /**
     * Validate hireDate - không được trong tương lai (có thể cho phép hôm nay)
     */
    public void validateHireDateNotFuture(LocalDate hireDate) {
        if (hireDate != null && hireDate.isAfter(LocalDate.now())) {
            throw ErrorCode.INVALID_HIRE_DATE.toException("Ngày tuyển dụng không được trong tương lai");
        }
    }
    
    /**
     * Validate date range - endDate phải sau startDate
     */
    public void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && !endDate.isAfter(startDate)) {
            throw ErrorCode.INVALID_DATE_RANGE.toException("Ngày kết thúc phải sau ngày bắt đầu");
        }
    }
    
    /**
     * Validate EmployeeStatus enum value
     */
    public void validateEmployeeStatus(String statusStr) {
        if (statusStr == null || statusStr.trim().isEmpty()) {
            return; // Optional field
        }
        try {
            EmployeeStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_STATUS_VALUE.toException(
                "Status phải là một trong: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED");
        }
    }

    /**
     * Validate employeeCode
     */
    public void validateEmployeeCode(String employeeCode) {
        if (employeeCode == null || employeeCode.trim().isEmpty()) {
            throw ErrorCode.INVALID_EMPLOYEE_CODE.toException();
        }
    }

    /**
     * Validate department
     */
    public void validateDepartment(String department) {
        if (department == null || department.trim().isEmpty()) {
            throw ErrorCode.INVALID_DEPARTMENT.toException();
        }
    }

    /**
     * Validate position
     */
    public void validatePosition(String position) {
        if (position == null || position.trim().isEmpty()) {
            throw ErrorCode.INVALID_POSITION.toException();
        }
    }

    /**
     * Validate hireDate
     */
    public void validateHireDate(java.time.LocalDate hireDate) {
        if (hireDate == null) {
            throw ErrorCode.INVALID_HIRE_DATE.toException();
        }
    }

    /**
     * Validate status string
     */
    public void validateStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw ErrorCode.INVALID_STATUS.toException();
        }
    }

    /**
     * Validate baseSalary
     */
    public void validateBaseSalary(BigDecimal baseSalary) {
        if (baseSalary == null) {
            throw ErrorCode.INVALID_BASE_SALARY.toException();
        }
        if (baseSalary.compareTo(BigDecimal.ZERO) < 0) {
            throw ErrorCode.INVALID_BASE_SALARY_NEGATIVE.toException();
        }
    }

    /**
     * Validate ProfileUpdateRequest
     */
    public void validateProfileUpdateRequest(ProfileUpdateRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
        if (request.getFullName() != null) {
            validateFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            validateEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            validatePhone(request.getPhone());
        }
    }
    
    /**
     * Validate AddEmployeeRequest - validate tất cả dữ liệu nhập từ người dùng
     */
    public void validateAddEmployeeRequest(AddEmployeeRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
        
        // Validate required fields
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw ErrorCode.INVALID_FULL_NAME.toException();
        }
        validateFullName(request.getName());
        
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw ErrorCode.INVALID_EMAIL.toException();
        }
        validateEmail(request.getEmail());
        
        if (request.getPosition() == null || request.getPosition().trim().isEmpty()) {
            throw ErrorCode.INVALID_POSITION.toException();
        }
        validatePosition(request.getPosition());
        
        if (request.getDepartment() == null || request.getDepartment().trim().isEmpty()) {
            throw ErrorCode.INVALID_DEPARTMENT.toException();
        }
        validateDepartment(request.getDepartment());
        
        // Validate optional fields
        if (request.getPhone() != null) {
            validatePhone(request.getPhone());
        }
        
        if (request.getPersonalEmail() != null && !request.getPersonalEmail().trim().isEmpty()) {
            validateEmail(request.getPersonalEmail());
        }
        
        // Validate dates
        if (request.getHireDate() == null) {
            throw ErrorCode.INVALID_HIRE_DATE.toException();
        }
        validateHireDateNotFuture(request.getHireDate());
        
        if (request.getDateOfBirth() != null) {
            validateDateOfBirth(request.getDateOfBirth());
        }
        
        // Validate status enum
        if (request.getStatus() != null) {
            validateEmployeeStatus(request.getStatus());
        }
        
        // Validate salary
        if (request.getSalary() == null) {
            throw ErrorCode.INVALID_BASE_SALARY.toException();
        }
        validateBaseSalary(request.getSalary());
    }
}

