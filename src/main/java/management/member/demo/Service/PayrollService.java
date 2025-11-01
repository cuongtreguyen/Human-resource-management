package management.member.demo.Service;

import management.member.demo.dto.PayrollRequest;
import management.member.demo.dto.PayrollResponse;
import management.member.demo.entity.Payroll;
import management.member.demo.entity.Salary;
import management.member.demo.Enum.PayrollStatus;
import management.member.demo.Enum.SalaryStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.Mapper.PayrollMapper;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.PayrollRepository;
import management.member.demo.repository.SalaryRepository;
import management.member.demo.validator.PayrollValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * PayrollService - Service xử lý đồng bộ status giữa Payroll và Salary
 * Tự động đồng bộ Salary status khi Payroll status thay đổi
 * Tuân thủ pattern EmployeeService: dùng Mapper và Validator
 */
@Service
public class PayrollService {

    /**
     * Map chuyển đổi giữa PayrollStatus và SalaryStatus
     * Khi Payroll status thay đổi → tự động đồng bộ Salary status
     */
    private static final Map<PayrollStatus, SalaryStatus> STATUS_MAPPING = Map.of(
            PayrollStatus.PENDING, SalaryStatus.AWAITING,    // PENDING → AWAITING (khi approve)
            PayrollStatus.PAID, SalaryStatus.SUCCESS,        // PAID → SUCCESS
            PayrollStatus.FAILED, SalaryStatus.FAILED,       // FAILED → FAILED
            PayrollStatus.CANCELLED, SalaryStatus.CANCELLED  // CANCELLED → CANCELLED
    );

    private final PayrollRepository payrollRepository;
    private final SalaryRepository salaryRepository;
    private final PayrollMapper payrollMapper;
    private final PayrollValidator payrollValidator;

    @Autowired
    public PayrollService(PayrollRepository payrollRepository, 
                         SalaryRepository salaryRepository,
                         PayrollMapper payrollMapper,
                         PayrollValidator payrollValidator) {
        this.payrollRepository = payrollRepository;
        this.salaryRepository = salaryRepository;
        this.payrollMapper = payrollMapper;
        this.payrollValidator = payrollValidator;
    }

    /**
     * Lấy thông tin Payroll theo ID
     */
    public PayrollResponse getPayrollById(Long id) {
        payrollValidator.validatePayrollId(id);
        
        Payroll payroll = findPayrollById(id);
        return payrollMapper.toResponse(payroll);
    }

    /**
     * Tạo Payroll mới
     */
    public PayrollResponse createPayroll(PayrollRequest request) {
        payrollValidator.validatePayrollRequest(request);
        payrollValidator.validateCodeNotExists(request.getCode(), null);
        
        Payroll payroll = payrollMapper.toEntity(request);
        Payroll savedPayroll = payrollRepository.save(payroll);
        return payrollMapper.toResponse(savedPayroll);
    }

    /**
     * Cập nhật Payroll
     */
    public PayrollResponse updatePayroll(Long id, PayrollRequest request) {
        payrollValidator.validatePayrollId(id);
        payrollValidator.validatePayrollRequest(request);
        payrollValidator.validateCodeNotExists(request.getCode(), id);
        
        Payroll payroll = findPayrollById(id);
        payrollMapper.updatePayrollFromRequest(payroll, request);
        
        Payroll savedPayroll = payrollRepository.save(payroll);
        return payrollMapper.toResponse(savedPayroll);
    }

    /**
     * Method tổng quát: Cập nhật Payroll status và tự động đồng bộ Salary status
     * 
     * @param payrollId ID của Payroll
     * @param newStatus Trạng thái mới của Payroll
     */
    @Transactional
    public void updatePayrollStatus(Long payrollId, PayrollStatus newStatus) {
        payrollValidator.validatePayrollId(payrollId);
        
        Payroll payroll = findPayrollById(payrollId);
        
        // Nếu trạng thái không thay đổi (currentStatus == newStatus), chỉ đồng bộ Salary nếu có mapping
        // Trường hợp này dùng cho approvePayroll khi Payroll đã ở PENDING
        if (payroll.getStatus() == newStatus) {
            if (STATUS_MAPPING.containsKey(newStatus)) {
                SalaryStatus salaryStatus = STATUS_MAPPING.get(newStatus);
                List<Salary> salaries = salaryRepository.findByPayrollId(payrollId);
                salaries.forEach(s -> s.setStatus(salaryStatus));
                salaryRepository.saveAll(salaries);
            }
            return;
        }
        
        // Validate status transition nếu trạng thái thay đổi
        payrollValidator.validateStatusTransition(payroll.getStatus(), newStatus);
        
        // Cập nhật Payroll status
        payroll.setStatus(newStatus);
        payrollRepository.save(payroll);
        
        // Nếu trạng thái có mapping sang SalaryStatus → đồng bộ
        if (STATUS_MAPPING.containsKey(newStatus)) {
            SalaryStatus salaryStatus = STATUS_MAPPING.get(newStatus);
            List<Salary> salaries = salaryRepository.findByPayrollId(payrollId);
            salaries.forEach(s -> s.setStatus(salaryStatus));
            salaryRepository.saveAll(salaries);
        }
    }

    /**
     * Đồng bộ Salary status khi Admin duyệt bảng lương
     * Sử dụng updatePayrollStatus() để giữ consistency và tận dụng mapping
     * Payroll status → PENDING → Salary status → AWAITING (theo STATUS_MAPPING)
     * 
     * @param payrollId ID của Payroll
     */
    public void approvePayroll(Long payrollId) {
        payrollValidator.validatePayrollId(payrollId);
        Payroll payroll = findPayrollById(payrollId);
        payrollValidator.validateCanApprove(payroll);
        
        // Dùng chung updatePayrollStatus() với PENDING
        // Nếu Payroll đã ở PENDING, chỉ đồng bộ Salary status
        // Nếu chưa ở PENDING, sẽ set về PENDING và đồng bộ Salary
        updatePayrollStatus(payrollId, PayrollStatus.PENDING);
    }

    /**
     * Đồng bộ Salary status khi Admin thanh toán bảng lương
     * Payroll status → PAID → Tất cả Salary chuyển SUCCESS
     * 
     * @param payrollId ID của Payroll
     */
    public void payPayroll(Long payrollId) {
        updatePayrollStatus(payrollId, PayrollStatus.PAID);
    }

    /**
     * Đồng bộ Salary status khi thanh toán Payroll thất bại
     * Payroll status → FAILED → Tất cả Salary chuyển FAILED
     * 
     * @param payrollId ID của Payroll
     */
    public void failPayroll(Long payrollId) {
        updatePayrollStatus(payrollId, PayrollStatus.FAILED);
    }

    /**
     * Đồng bộ Salary status khi Admin hủy bảng lương
     * Payroll status → CANCELLED → Tất cả Salary chuyển CANCELLED
     * 
     * @param payrollId ID của Payroll
     */
    public void cancelPayroll(Long payrollId) {
        updatePayrollStatus(payrollId, PayrollStatus.CANCELLED);
    }

    /**
     * Tìm Payroll theo ID, throw exception nếu không tìm thấy
     */
    private Payroll findPayrollById(Long payrollId) {
        return payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.PAYROLL_NOT_FOUND.getMessage() + " với ID: " + payrollId));
    }
}
