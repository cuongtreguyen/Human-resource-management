package management.member.demo.validator;

import management.member.demo.exception.model.ErrorCode;
import management.member.demo.dto.PayrollRequest;
import management.member.demo.entity.Payroll;
import management.member.demo.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Validator class - Chỉ chịu trách nhiệm validate Payroll data
 */
@Component
public class PayrollValidator {

    private final PayrollRepository payrollRepository;

    @Autowired
    public PayrollValidator(PayrollRepository payrollRepository) {
        this.payrollRepository = payrollRepository;
    }

    /**
     * Validate Payroll ID
     */
    public void validatePayrollId(Long id) {
        if (id == null) {
            throw ErrorCode.INVALID_PAYROLL_ID.toException();
        }
    }

    /**
     * Validate Payroll entity không null
     */
    public void validatePayroll(Payroll payroll) {
        if (payroll == null) {
            throw ErrorCode.INVALID_PAYROLL.toException();
        }
    }

    /**
     * Validate PayrollRequest không null
     */
    public void validateRequest(PayrollRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
    }

    /**
     * Validate tất cả các trường trong PayrollRequest
     */
    public void validatePayrollRequest(PayrollRequest request) {
        validateRequest(request);
        validateCode(request.getCode());
        validatePeriod(request.getPeriod());
        validateStatus(request.getStatus());
    }

    /**
     * Validate code
     */
    public void validateCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            throw ErrorCode.INVALID_PAYROLL_CODE.toException();
        }
    }

    /**
     * Validate code không trùng khi tạo mới
     */
    public void validateCodeNotExists(String code, Long excludeId) {
        if (code == null || code.trim().isEmpty()) {
            return; // validateCode sẽ xử lý
        }
        
        payrollRepository.findByCode(code).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw ErrorCode.INVALID_PAYROLL_CODE_EXISTS.toException();
            }
        });
    }

    /**
     * Validate period
     */
    public void validatePeriod(java.time.LocalDate period) {
        if (period == null) {
            throw ErrorCode.INVALID_PAYROLL_PERIOD.toException();
        }
    }

    /**
     * Validate status
     */
    public void validateStatus(management.member.demo.Enum.PayrollStatus status) {
        if (status == null) {
            throw ErrorCode.INVALID_PAYROLL_STATUS.toException();
        }
    }

    /**
     * Validate Payroll có thể duyệt (status phải là PENDING)
     */
    public void validateCanApprove(Payroll payroll) {
        if (payroll == null) {
            throw ErrorCode.INVALID_PAYROLL.toException();
        }
        if (payroll.getStatus() != management.member.demo.Enum.PayrollStatus.PENDING) {
            throw ErrorCode.INVALID_PAYROLL_OPERATION.toException("Chỉ có thể duyệt Payroll có status PENDING");
        }
    }

    /**
     * Validate Payroll có thể hủy (không phải PAID)
     */
    public void validateCanCancel(Payroll payroll) {
        if (payroll == null) {
            throw ErrorCode.INVALID_PAYROLL.toException();
        }
        if (payroll.getStatus() == management.member.demo.Enum.PayrollStatus.PAID) {
            throw ErrorCode.INVALID_PAYROLL_OPERATION.toException("Không thể hủy Payroll đã thanh toán");
        }
    }

    /**
     * Validate chuyển đổi trạng thái Payroll
     * 
     * @param currentStatus Trạng thái hiện tại
     * @param newStatus Trạng thái mới
     */
    public void validateStatusTransition(management.member.demo.Enum.PayrollStatus currentStatus, 
                                        management.member.demo.Enum.PayrollStatus newStatus) {
        if (currentStatus == null || newStatus == null) {
            throw ErrorCode.INVALID_PAYROLL_STATUS.toException();
        }
        
        // Không cho phép chuyển sang trạng thái giống nhau
        if (currentStatus == newStatus) {
            throw ErrorCode.INVALID_PAYROLL_OPERATION.toException(
                    String.format("Payroll đã ở trạng thái %s", currentStatus));
        }
        
        // Không cho phép hủy Payroll đã thanh toán
        if (currentStatus == management.member.demo.Enum.PayrollStatus.PAID 
                && newStatus == management.member.demo.Enum.PayrollStatus.CANCELLED) {
            throw ErrorCode.INVALID_PAYROLL_OPERATION.toException("Không thể hủy Payroll đã thanh toán");
        }
        
        // Không cho phép chuyển từ CANCELLED sang trạng thái khác (trừ khi cần reset)
        if (currentStatus == management.member.demo.Enum.PayrollStatus.CANCELLED) {
            throw ErrorCode.INVALID_PAYROLL_OPERATION.toException("Không thể thay đổi trạng thái của Payroll đã bị hủy");
        }
    }
}

