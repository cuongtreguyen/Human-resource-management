package management.member.demo.service;

import management.member.demo.dto.SalaryRequest;
import management.member.demo.dto.SalaryResponse;
import management.member.demo.dto.SalarySummaryResponse;
import management.member.demo.entity.Salary;
import management.member.demo.entity.Employee;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.SalaryMapper;
import management.member.demo.repository.SalaryRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional
public class SalaryService {

    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SalaryMapper salaryMapper;

    public BigDecimal calculateLatestSalary(Long employeeId) {
        List<Salary> salaries = salaryRepository.findFirstByEmployeeIdOrderByPayrollPaymentDateDesc(employeeId);
        if (salaries.isEmpty()) {
            throw new ResourceNotFoundException(
                    ErrorCode.SALARY_NOT_FOUND.getMessage() + " cho nhân viên ID: " + employeeId);
        }
        Salary latestSalary = salaries.get(0);
        return latestSalary.getNetSalary() != null ? latestSalary.getNetSalary() : BigDecimal.ZERO;
    }

    public BigDecimal calculateAverageSalary(Long employeeId) {
        List<Salary> salaries = salaryRepository.findByEmployeeIdOrderByPayrollPaymentDateDesc(employeeId);
        if (salaries.isEmpty()) {
            throw new ResourceNotFoundException(
                    ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId);
        }

        BigDecimal sum = salaries.stream()
                .map(s -> s.getNetSalary() != null ? s.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return sum.divide(BigDecimal.valueOf(salaries.size()), 2, RoundingMode.HALF_UP);
    }

    public SalarySummaryResponse getSalarySummary(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        List<Salary> salaries = salaryRepository.findByEmployeeIdOrderByPayrollPaymentDateDesc(employeeId);

        SalarySummaryResponse response = new SalarySummaryResponse();
        response.setLatestSalary(calculateLatestSalary(employeeId));
        response.setAverageSalary(calculateAverageSalary(employeeId));
        response.setTotalIncome(salaries.stream()
                .map(s -> s.getNetSalary() != null ? s.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        return response;
    }

    public SalaryResponse createSalary(SalaryRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getEmployeeId()));

        Salary salary = salaryMapper.toEntity(request);

        // Set Employee entity thay vì employeeId
        salary.setEmployee(employee);

        // Tính toán các field mới
        calculateSalaryFields(salary);

        salary.setStatus(management.member.demo.enums.SalaryStatus.AWAITING);

        Salary saved = salaryRepository.save(salary);
        return salaryMapper.toResponse(saved);
    }

    /**
     * Tính số giờ OT dựa trên remainingOtHours của Employee
     * Công thức: otHours = 40 - remainingOtHours
     *
     * @param employeeId ID của nhân viên
     * @return Số giờ OT đã làm
     */
    public BigDecimal calculateOtHours(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        Integer remainingOtHours = employee.getRemainingOtHours() != null ? employee.getRemainingOtHours() : 40;
        BigDecimal otHours = BigDecimal.valueOf(40).subtract(BigDecimal.valueOf(remainingOtHours));

        // Đảm bảo otHours không âm
        return otHours.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : otHours;
    }

    /**
     * Tính tiền OT dựa trên số giờ OT
     * Công thức: otPay = otHours * 100,000 VND/giờ
     *
     * @param otHours Số giờ OT
     * @return Tiền OT (VND)
     */
    public BigDecimal calculateOtPay(BigDecimal otHours) {
        if (otHours == null || otHours.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal otRatePerHour = new BigDecimal("100000"); // 100,000 VND/giờ
        return otHours.multiply(otRatePerHour).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Tính tiền OT từ employeeId (tự động tính otHours trước)
     *
     * @param employeeId ID của nhân viên
     * @return Tiền OT (VND)
     */
    public BigDecimal calculateOtPayFromEmployeeId(Long employeeId) {
        BigDecimal otHours = calculateOtHours(employeeId);
        return calculateOtPay(otHours);
    }

    /**
     * Tính thuế thu nhập cá nhân theo bậc thuế suất lũy tiến
     * Bậc thuế:
     * - 0 – 5 triệu: 5%
     * - 5 – 10 triệu: 10%
     * - 10 – 18 triệu: 15%
     * - 18 – 32 triệu: 20%
     * - 32 – 52 triệu: 25%
     * - 52 – 80 triệu: 30%
     * - Trên 80 triệu: 35%
     *
     * @param taxableIncome Thu nhập tính thuế (grossIncome sau khi trừ các khoản miễn thuế)
     * @return Thuế thu nhập cá nhân (VND)
     */
    public BigDecimal calculatePersonalIncomeTax(BigDecimal taxableIncome) {
        if (taxableIncome == null || taxableIncome.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal remaining = taxableIncome;

        // Bậc 1: 0 – 5 triệu: 5%
        if (remaining.compareTo(new BigDecimal("5000000")) > 0) {
            BigDecimal amount = new BigDecimal("5000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.05")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.05")));
            return tax.setScale(2, RoundingMode.HALF_UP);
        }

        // Bậc 2: 5 – 10 triệu: 10%
        if (remaining.compareTo(new BigDecimal("5000000")) > 0) {
            BigDecimal amount = new BigDecimal("5000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.10")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.10")));
            return tax.setScale(2, RoundingMode.HALF_UP);
        }

        // Bậc 3: 10 – 18 triệu: 15%
        if (remaining.compareTo(new BigDecimal("8000000")) > 0) {
            BigDecimal amount = new BigDecimal("8000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.15")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.15")));
            return tax.setScale(2, RoundingMode.HALF_UP);
        }

        // Bậc 4: 18 – 32 triệu: 20%
        if (remaining.compareTo(new BigDecimal("14000000")) > 0) {
            BigDecimal amount = new BigDecimal("14000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.20")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.20")));
            return tax.setScale(2, RoundingMode.HALF_UP);
        }

        // Bậc 5: 32 – 52 triệu: 25%
        if (remaining.compareTo(new BigDecimal("20000000")) > 0) {
            BigDecimal amount = new BigDecimal("20000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.25")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.25")));
            return tax.setScale(2, RoundingMode.HALF_UP);
        }

        // Bậc 6: 52 – 80 triệu: 30%
        if (remaining.compareTo(new BigDecimal("28000000")) > 0) {
            BigDecimal amount = new BigDecimal("28000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.30")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.30")));
            return tax.setScale(2, RoundingMode.HALF_UP);
        }

        // Bậc 7: Trên 80 triệu: 35%
        if (remaining.compareTo(BigDecimal.ZERO) > 0) {
            tax = tax.add(remaining.multiply(new BigDecimal("0.35")));
        }

        return tax.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Tính toán các field phái sinh: grossIncome, totalInsurance, netSalary
     * otHours không còn trong Salary entity, sẽ tính từ OverTime trong PayrollService
     */
    private void calculateSalaryFields(Salary salary) {
        // otHours không còn trong Salary entity, sẽ tính từ OverTime
        // Nếu chưa có otPay, giữ nguyên (sẽ được tính từ OverTime trong PayrollService)

        // Lấy baseSalary từ Employee
        Employee employee = salary.getEmployee() != null ?
                (salary.getEmployee().getId() != null ?
                        employeeRepository.findById(salary.getEmployee().getId()).orElse(null) :
                        salary.getEmployee()) : null;
        BigDecimal baseSalary = employee != null && employee.getBaseSalary() != null ?
                employee.getBaseSalary() : BigDecimal.ZERO;

        BigDecimal bonus = salary.getBonus() != null ? salary.getBonus() : BigDecimal.ZERO;
        BigDecimal allowance = salary.getAllowance() != null ? salary.getAllowance() : BigDecimal.ZERO;
        BigDecimal otPay = salary.getOtPay() != null ? salary.getOtPay() : BigDecimal.ZERO;

        BigDecimal grossIncome = baseSalary
                .add(bonus)
                .add(allowance)
                .add(otPay);
        salary.setGrossIncome(grossIncome);

        // Tính các khoản bảo hiểm tự động nếu chưa có (tính trên baseSalary từ Employee)
        // BHXH: 8% của baseSalary
        if (salary.getSocialInsurance() == null) {
            BigDecimal socialInsurance = baseSalary
                    .multiply(new BigDecimal("0.08"))
                    .setScale(2, RoundingMode.HALF_UP);
            salary.setSocialInsurance(socialInsurance);
        }

        // BHYT: 1.5% của baseSalary
        if (salary.getHealthInsurance() == null) {
            BigDecimal healthInsurance = baseSalary
                    .multiply(new BigDecimal("0.015"))
                    .setScale(2, RoundingMode.HALF_UP);
            salary.setHealthInsurance(healthInsurance);
        }

        // BHTN: 1% của baseSalary
        if (salary.getUnemploymentInsurance() == null) {
            BigDecimal unemploymentInsurance = baseSalary
                    .multiply(new BigDecimal("0.01"))
                    .setScale(2, RoundingMode.HALF_UP);
            salary.setUnemploymentInsurance(unemploymentInsurance);
        }

        // Tính totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance
        BigDecimal socialInsurance = salary.getSocialInsurance() != null ? salary.getSocialInsurance() : BigDecimal.ZERO;
        BigDecimal healthInsurance = salary.getHealthInsurance() != null ? salary.getHealthInsurance() : BigDecimal.ZERO;
        BigDecimal unemploymentInsurance = salary.getUnemploymentInsurance() != null ? salary.getUnemploymentInsurance() : BigDecimal.ZERO;

        BigDecimal totalInsurance = socialInsurance
                .add(healthInsurance)
                .add(unemploymentInsurance);
        salary.setTotalInsurance(totalInsurance);

        // Tính thu nhập chịu thuế (taxableIncome) = grossIncome - BHXH - BHYT - BHTN - Giảm trừ bản thân (11,000,000)
        BigDecimal personalDeduction = new BigDecimal("11000000"); // Giảm trừ bản thân
        BigDecimal taxableIncome = grossIncome
                .subtract(socialInsurance)
                .subtract(healthInsurance)
                .subtract(unemploymentInsurance)
                .subtract(personalDeduction);

        // Đảm bảo taxableIncome không âm
        if (taxableIncome.compareTo(BigDecimal.ZERO) < 0) {
            taxableIncome = BigDecimal.ZERO;
        }

        // Tính thuế thu nhập cá nhân (tính trên taxableIncome, không phải grossIncome)
        BigDecimal personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);
        salary.setPersonalIncomeTax(personalIncomeTax);

        // Tính totalDeductions = socialInsurance + healthInsurance + unemploymentInsurance + personalIncomeTax + generalDeductions
        BigDecimal generalDeductions = salary.getGeneralDeductions() != null ? salary.getGeneralDeductions() : BigDecimal.ZERO;

        BigDecimal totalDeductions = socialInsurance
                .add(healthInsurance)
                .add(unemploymentInsurance)
                .add(personalIncomeTax)
                .add(generalDeductions);
        salary.setTotalDeductions(totalDeductions);

        // Tính netSalary = grossIncome - totalDeductions
        BigDecimal netSalary = grossIncome.subtract(totalDeductions);
        salary.setNetSalary(netSalary);
    }

    public BigDecimal calculateTotalIncome(Long employeeId) {
        List<Salary> salaries = salaryRepository.findByEmployeeIdOrderByPayrollPaymentDateDesc(employeeId);
        return salaries.stream()
                .map(s -> s.getNetSalary() != null ? s.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public SalaryResponse getSalaryById(Long id) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.SALARY_NOT_FOUND.getMessage() + " với ID: " + id));
        return salaryMapper.toResponse(salary);
    }

    public SalaryResponse updateSalary(Long id, SalaryRequest request) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary not found with id: " + id));

        // Update từ request (mapper sẽ xử lý alias fields)
        salaryMapper.updateSalaryFromRequest(salary, request);

        // Recalculate các field phái sinh
        calculateSalaryFields(salary);

        Salary updated = salaryRepository.save(salary);
        return salaryMapper.toResponse(updated);
    }

    // ====================== 4 METHOD CHẮC CHẮN CHẠY NGON CHO /my-* ======================
    // Tính lương thực nhận của nhân viên từ Salary entity
    private BigDecimal calcTakeHomePay(Salary salary) {
        return salary.getNetSalary() != null ? salary.getNetSalary() : BigDecimal.ZERO;
    }

    // Tính lương trung bình của nhân viên
    public BigDecimal getMyAverageSalary(Long employeeId) {
        List<Salary> list = salaryRepository.findByEmployeeId(employeeId);
        if (list.isEmpty()) return BigDecimal.ZERO;
        BigDecimal sum = list.stream().map(this::calcTakeHomePay).reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.divide(BigDecimal.valueOf(list.size()), 0, RoundingMode.HALF_UP);
    }

    // Tính tổng thu nhập của nhân viên
    public BigDecimal getMyTotalIncome(Long employeeId) {
        return salaryRepository.findByEmployeeId(employeeId).stream()
                .map(this::calcTakeHomePay)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Lấy lương mới nhất của nhân viên
    public BigDecimal getMyLatestSalary(Long employeeId) {
        List<Salary> list = salaryRepository.findFirstByEmployeeIdOrderByPayrollPaymentDateDesc(employeeId);
        if (list.isEmpty()) return BigDecimal.ZERO;
        return calcTakeHomePay(list.get(0));
    }

    private BigDecimal calcTakeHomePay(SalaryResponse salaryResponse) {
        return salaryResponse.getNetSalary() != null ? salaryResponse.getNetSalary() : BigDecimal.ZERO;
    }

    // lấy getMySalarySummary
    public SalarySummaryResponse getMySalarySummary(Long employeeId) {
        List<Salary> salaries = salaryRepository.findByEmployeeIdOrderByPayrollPaymentDateDesc(employeeId);

        SalarySummaryResponse response = new SalarySummaryResponse();
        response.setLatestSalary(getMyLatestSalary(employeeId));
        response.setAverageSalary(getMyAverageSalary(employeeId));
        response.setTotalIncome(getMyTotalIncome(employeeId));

        return response;
    }

}
