package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import management.member.demo.dto.SalaryRequest;
import management.member.demo.entity.Salary;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Validator class - Chỉ chịu trách nhiệm validate Salary data
 */
@Component
public class SalaryValidator {

    /**
     * Validate Salary ID
     */
    public void validateSalaryId(Long id) {
        if (id == null) {
            throw ErrorCode.INVALID_SALARY_ID.toException();
        }
    }

    /**
     * Validate Salary entity không null
     */
    public void validateSalary(Salary salary) {
        if (salary == null) {
            throw ErrorCode.INVALID_SALARY.toException();
        }
    }

    /**
     * Validate SalaryRequest không null
     */
    public void validateRequest(SalaryRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
    }

    /**
     * Validate tất cả các trường trong SalaryRequest
     */
    public void validateSalaryRequest(SalaryRequest request) {
        validateRequest(request);
        validateEmployeeId(request.getEmployeeId());
        validateBaseSalary(request.getBaseSalary());
        validateStatus(request.getStatus());
        validatePaymentDate(request.getPaymentDate());
    }

    /**
     * Validate employeeId
     */
    public void validateEmployeeId(Long employeeId) {
        if (employeeId == null) {
            throw ErrorCode.INVALID_SALARY_EMPLOYEE_ID.toException();
        }
    }

    /**
     * Validate baseSalary
     */
    public void validateBaseSalary(BigDecimal baseSalary) {
        if (baseSalary == null) {
            throw ErrorCode.INVALID_SALARY_BASE_SALARY.toException();
        }
        if (baseSalary.compareTo(BigDecimal.ZERO) < 0) {
            throw ErrorCode.INVALID_SALARY_BASE_SALARY_NEGATIVE.toException();
        }
    }

    /**
     * Validate status
     */
    public void validateStatus(management.member.demo.Enum.SalaryStatus status) {
        if (status == null) {
            throw ErrorCode.INVALID_SALARY_STATUS.toException();
        }
    }

    /**
     * Validate paymentDate
     */
    public void validatePaymentDate(java.time.LocalDate paymentDate) {
        if (paymentDate == null) {
            throw ErrorCode.INVALID_PAYMENT_DATE.toException();
        }
    }
}

