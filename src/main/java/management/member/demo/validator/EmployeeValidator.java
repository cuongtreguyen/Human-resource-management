package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.ProfileUpdateRequest;
import management.member.demo.entity.Employee;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Validator class - Chỉ chịu trách nhiệm validate Employee data
 */
@Component
public class EmployeeValidator {

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
        validateFirstName(request.getFirstName());
        validateLastName(request.getLastName());
        validateEmail(request.getEmail());
        validateEmployeeCode(request.getEmployeeCode());
        validateDepartment(request.getDepartment());
        validatePosition(request.getPosition());
        validateHireDate(request.getHireDate());
        validateStatus(String.valueOf(request.getStatus()));
        validateBaseSalary(request.getBaseSalary());
    }

    /**
     * Validate firstName
     */
    public void validateFirstName(String firstName) {
        if (firstName == null || firstName.trim().isEmpty()) {
            throw ErrorCode.INVALID_FIRST_NAME.toException();
        }
    }

    /**
     * Validate lastName
     */
    public void validateLastName(String lastName) {
        if (lastName == null || lastName.trim().isEmpty()) {
            throw ErrorCode.INVALID_LAST_NAME.toException();
        }
    }

    /**
     * Validate email
     */
    public void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw ErrorCode.INVALID_EMAIL.toException();
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
        validateFirstName(request.getFirstName());
        validateLastName(request.getLastName());
        validateEmail(request.getEmail());
        // phone và address là optional, không cần validate
    }
}

