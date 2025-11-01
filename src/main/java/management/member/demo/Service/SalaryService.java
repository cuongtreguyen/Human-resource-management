package management.member.demo.Service;

import management.member.demo.dto.SalaryRequest;
import management.member.demo.dto.SalaryResponse;
import management.member.demo.dto.SalarySummaryResponse;
import management.member.demo.entity.Employee;
import management.member.demo.entity.Salary;
import management.member.demo.Enum.SalaryStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.Mapper.SalaryMapper;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.SalaryRepository;
import management.member.demo.validator.SalaryValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * SalaryService - Service xử lý tính toán và quản lý salary
 * Tuân thủ pattern EmployeeService: dùng Mapper và Validator
 */
@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryMapper salaryMapper;
    private final SalaryValidator salaryValidator;

    @Autowired
    public SalaryService(SalaryRepository salaryRepository, 
                        EmployeeRepository employeeRepository,
                        SalaryMapper salaryMapper,
                        SalaryValidator salaryValidator) {
        this.salaryRepository = salaryRepository;
        this.employeeRepository = employeeRepository;
        this.salaryMapper = salaryMapper;
        this.salaryValidator = salaryValidator;
    }

    /**
     * Công thức tính Net Salary:
     * BaseSalary + Allowance + Overtime + Bonus - Deduction
     */
    private BigDecimal calculateNetSalary(BigDecimal base, BigDecimal allowance, BigDecimal overtime, BigDecimal bonus, BigDecimal deduction) {
        return safe(base)
                .add(safe(allowance))
                .add(safe(overtime))
                .add(safe(bonus))
                .subtract(safe(deduction));
    }

    /** Helper tránh null */
    private BigDecimal safe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    /**
     * Lương tháng gần nhất
     */
    public BigDecimal calculateLatestSalary(Long employeeId) {
        Salary salary = salaryRepository.findFirstByEmployeeIdOrderByPaymentDateDesc(employeeId).orElse(null);

        if (salary != null) {
            return calculateNetSalary(
                    salary.getBaseSalary(),
                    salary.getAllowance(),
                    salary.getOvertimePay(),
                    salary.getBonus(),
                    salary.getDeduction()
            );
        }

        Employee emp = findEmployeeById(employeeId);
        return safe(emp.getBaseSalary());
    }

    /**
     * Lương trung bình (trên các kỳ đã trả thành công)
     */
    public BigDecimal calculateAverageSalary(Long employeeId) {
        salaryValidator.validateEmployeeId(employeeId);
        
        List<Salary> valid = salaryRepository.findByEmployeeIdAndStatusOrderByPaymentDateDesc(employeeId, SalaryStatus.SUCCESS);

        if (valid.isEmpty()) return BigDecimal.ZERO;

        BigDecimal total = valid.stream()
                .map(Salary::getNetSalary)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return total.divide(BigDecimal.valueOf(valid.size()), 2, RoundingMode.HALF_UP);
    }

    /**
     * Tổng thu nhập (toàn bộ các kỳ đã trả)
     */
    public BigDecimal calculateTotalIncome(Long employeeId) {
        salaryValidator.validateEmployeeId(employeeId);
        
        return salaryRepository.findByEmployeeIdAndStatusOrderByPaymentDateDesc(employeeId, SalaryStatus.SUCCESS)
                .stream()
                .map(Salary::getNetSalary)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Tổng hợp thông tin lương: latest, average, total
     */
    public SalarySummaryResponse getSalarySummary(Long employeeId) {
        salaryValidator.validateEmployeeId(employeeId);

        return SalarySummaryResponse.builder()
                .latestSalary(calculateLatestSalary(employeeId))
                .averageSalary(calculateAverageSalary(employeeId))
                .totalIncome(calculateTotalIncome(employeeId))
                .build();
    }

    /**
     * Lấy thông tin Salary theo ID
     */
    public SalaryResponse getSalaryById(Long id) {
        salaryValidator.validateSalaryId(id);
        
        Salary salary = findSalaryById(id);
        return salaryMapper.toResponse(salary);
    }

    /**
     * Tạo Salary mới
     * Tự động tính netSalary trước khi lưu xuống database
     */
    public SalaryResponse createSalary(SalaryRequest request) {
        salaryValidator.validateSalaryRequest(request);
        
        // Validate employee tồn tại
        findEmployeeById(request.getEmployeeId());
        
        // Tạo Salary entity từ request
        Salary salary = salaryMapper.toEntity(request);
        
        // Tự động tính netSalary
        BigDecimal netSalary = calculateNetSalary(
                salary.getBaseSalary(),
                salary.getAllowance(),
                salary.getOvertimePay(),
                salary.getBonus(),
                salary.getDeduction()
        );
        salary.setNetSalary(netSalary);
        
        // Set status mặc định là AWAITING nếu chưa có
        if (salary.getStatus() == null) {
            salary.setStatus(SalaryStatus.AWAITING);
        }
        
        // Lưu xuống database
        Salary savedSalary = salaryRepository.save(salary);
        return salaryMapper.toResponse(savedSalary);
    }

    /**
     * Cập nhật Salary
     * Tự động tính lại netSalary trước khi lưu xuống database
     */
    public SalaryResponse updateSalary(Long id, SalaryRequest request) {
        salaryValidator.validateSalaryId(id);
        salaryValidator.validateSalaryRequest(request);
        
        // Tìm Salary theo ID
        Salary salary = findSalaryById(id);
        
        // Validate employee tồn tại
        findEmployeeById(request.getEmployeeId());
        
        // Cập nhật các field
        salaryMapper.updateSalaryFromRequest(salary, request);
        
        // Tự động tính lại netSalary
        BigDecimal netSalary = calculateNetSalary(
                salary.getBaseSalary(),
                salary.getAllowance(),
                salary.getOvertimePay(),
                salary.getBonus(),
                salary.getDeduction()
        );
        salary.setNetSalary(netSalary);
        
        // Lưu xuống database
        Salary savedSalary = salaryRepository.save(salary);
        return salaryMapper.toResponse(savedSalary);
    }

    /**
     * Tìm Employee theo ID, throw exception nếu không tìm thấy
     */
    private Employee findEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id));
    }

    /**
     * Tìm Salary theo ID, throw exception nếu không tìm thấy
     */
    private Salary findSalaryById(Long id) {
        return salaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.SALARY_NOT_FOUND.getMessage() + " với ID: " + id));
    }
}
