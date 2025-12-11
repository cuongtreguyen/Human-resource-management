package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.dto.PayrollResponse;
import management.member.demo.dto.PayrollRequest;
import management.member.demo.entity.Payroll;
import management.member.demo.entity.Salary;
import management.member.demo.entity.Employee;
import management.member.demo.enums.PayrollStatus;
import management.member.demo.mapper.PayrollMapper;
import management.member.demo.repository.PayrollRepository;
import management.member.demo.repository.SalaryRepository;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.OverTimeRepository;
import management.member.demo.entity.OverTime;
import management.member.demo.enums.OverTimeStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.validator.PayrollValidator;
import java.time.YearMonth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PayrollMapper payrollMapper;

    @Autowired
    private OverTimeRepository overTimeRepository;

    @Autowired
    private management.member.demo.service.AttendanceService attendanceService;

    @Autowired
    private PayrollValidator payrollValidator;

    public PayrollResponse getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));
        return payrollMapper.toResponse(payroll);
    }

    public PayrollResponse createPayroll(PayrollRequest request) {
        Payroll payroll = new Payroll();
        payroll.setCode(request.getCode());
        payroll.setPeriod(request.getPeriod());
        payroll.setCreatedDate(LocalDate.now());
        payroll.setStatus(PayrollStatus.PENDING);
        payroll.setNote(request.getNote());

        Payroll saved = payrollRepository.save(payroll);
        return payrollMapper.toResponse(saved);
    }

    public PayrollResponse updatePayroll(Long id, PayrollRequest request) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        payroll.setCode(request.getCode());
        payroll.setPeriod(request.getPeriod());
        payroll.setNote(request.getNote());

        Payroll updated = payrollRepository.save(payroll);
        return payrollMapper.toResponse(updated);
    }

    public void approvePayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));
        // Note: PayrollStatus doesn't have APPROVED, using PENDING as approved state
        payroll.setStatus(PayrollStatus.PENDING);
        payrollRepository.save(payroll);
    }

    public void payPayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));
        payroll.setStatus(PayrollStatus.PAID);
        payroll.setPaymentDate(LocalDate.now()); // Set payment date khi thanh toán
        payrollRepository.save(payroll);
        
        // ⚠️ FIX: Update status của tất cả Salary records liên quan thành SUCCESS
        List<Salary> salaries = salaryRepository.findAll().stream()
                .filter(s -> s.getPayroll() != null && s.getPayroll().getId().equals(id))
                .collect(Collectors.toList());
        
        for (Salary salary : salaries) {
            salary.setStatus(management.member.demo.enums.SalaryStatus.SUCCESS);
            salary.setPaymentDate(LocalDate.now()); // Set payment date cho Salary
            salaryRepository.save(salary);
        }
    }
    
    /**
     * Thanh toán 1 Salary record cụ thể (không phải toàn bộ Payroll)
     * @param salaryId ID của Salary record cần thanh toán
     */
    public void paySalary(Long salaryId) {
        Salary salary = salaryRepository.findById(salaryId)
                .orElseThrow(() -> new RuntimeException("Salary not found with id: " + salaryId));
        
        // Update status của Salary record này thành SUCCESS
        salary.setStatus(management.member.demo.enums.SalaryStatus.SUCCESS);
        salary.setPaymentDate(LocalDate.now()); // Set payment date cho Salary
        salaryRepository.save(salary);
        
        // ⚠️ LƯU Ý: Không update Payroll status vì có thể còn Salary records khác chưa thanh toán
        // Nếu tất cả Salary records của Payroll đều SUCCESS, có thể tự động update Payroll status
        // Nhưng hiện tại không làm vậy để tránh side effects
    }

    public void failPayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));
        payroll.setStatus(PayrollStatus.FAILED);
        payrollRepository.save(payroll);
    }

    public void cancelPayroll(Long id) {
        payrollValidator.validatePayrollId(id);
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> ErrorCode.PAYROLL_NOT_FOUND.toException("Payroll không tồn tại với ID: " + id));
        payrollValidator.validateCanCancel(payroll);
        payroll.setStatus(PayrollStatus.CANCELLED);
        payrollRepository.save(payroll);
    }

    public PayrollListResponseDTO getAllPayrollRecords(String month, String employeeId, String status) {
        List<Salary> salaries = salaryRepository.findAll();
        List<management.member.demo.entity.Employee> employees = employeeRepository.findAll();
        java.util.Map<Long, String> employeeNames = employees.stream()
                .collect(Collectors.toMap(management.member.demo.entity.Employee::getId, management.member.demo.entity.Employee::getFullName));
        java.util.Map<Long, Employee> employeeMap = employees.stream()
                .collect(Collectors.toMap(Employee::getId, e -> e));

        // Apply filters
        if (month != null && !month.isEmpty()) {
            salaries = salaries.stream()
                    .filter(s -> s.getPayroll() != null && s.getPayroll().getPeriod().toString().startsWith(month))
                    .collect(Collectors.toList());
        }
        
        if (employeeId != null && !employeeId.isEmpty()) {
             // Try to parse employeeId as Long
             try {
                 Long empId = Long.parseLong(employeeId);
                 salaries = salaries.stream()
                         .filter(s -> s.getEmployee() != null && s.getEmployee().getId().equals(empId))
                         .collect(Collectors.toList());
             } catch (NumberFormatException e) {
                 // Ignore if not a number
             }
        }

        if (status != null && !status.isEmpty()) {
             salaries = salaries.stream()
                     .filter(s -> s.getStatus().name().equalsIgnoreCase(status))
                     .collect(Collectors.toList());
        }

        List<PayrollListItemDTO> payrollDTOs = salaries.stream().map(salary -> {
            PayrollListItemDTO dto = new PayrollListItemDTO();
            dto.setId(salary.getPayroll() != null ? String.valueOf(salary.getPayroll().getId()) : "");
            Long empId = salary.getEmployee() != null ? salary.getEmployee().getId() : null;
            Employee employee = empId != null ? employeeMap.get(empId) : null;
            dto.setEmployeeId(String.valueOf(empId));
            dto.setEmployeeName(employeeNames.getOrDefault(empId, "Unknown"));
            dto.setMonth(salary.getPayroll() != null ? salary.getPayroll().getPeriod().toString().substring(0, 7) : "");
            dto.setBasicSalary(employee != null && employee.getBaseSalary() != null ? employee.getBaseSalary() : BigDecimal.ZERO);
            dto.setAllowance(salary.getAllowance());
            dto.setOvertime(salary.getOtPay());
            dto.setBonus(salary.getBonus());
            dto.setDeduction(salary.getGeneralDeductions()); // Salary entity dùng generalDeductions
            dto.setNetSalary(salary.getNetSalary());
            dto.setStatus(salary.getStatus().name().toLowerCase());
            return dto;
        }).collect(Collectors.toList());

        PayrollListResponseDTO response = new PayrollListResponseDTO();
        response.setData(payrollDTOs);
        response.setSuccess(true);

        return response;
    }

    public CalculatePayrollResponseDTO calculatePayroll(CalculatePayrollRequestDTO request) {
        // Calculate payroll based on request
        BigDecimal basicSalary = request.getBasicSalary() != null ? request.getBasicSalary() : BigDecimal.ZERO;
        BigDecimal grossSalary = basicSalary
                .add(request.getAllowance() != null ? request.getAllowance() : BigDecimal.ZERO)
                .add(request.getOvertime() != null ? request.getOvertime() : BigDecimal.ZERO)
                .add(request.getBonus() != null ? request.getBonus() : BigDecimal.ZERO);

        // Calculate deductions - Insurance tính trên baseSalary (basicSalary), không phải grossSalary
        BigDecimal socialInsurance = basicSalary
                .multiply(new BigDecimal("0.08"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal healthInsurance = basicSalary
                .multiply(new BigDecimal("0.015"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal unemploymentInsurance = basicSalary
                .multiply(new BigDecimal("0.01"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
        
        // Tính thu nhập chịu thuế (taxableIncome) = grossSalary - BHXH - BHYT - BHTN - Giảm trừ bản thân (11,000,000)
        BigDecimal personalDeduction = new BigDecimal("11000000"); // Giảm trừ bản thân
        BigDecimal taxableIncome = grossSalary
                .subtract(socialInsurance)
                .subtract(healthInsurance)
                .subtract(unemploymentInsurance)
                .subtract(personalDeduction);
        
        // Đảm bảo taxableIncome không âm
        if (taxableIncome.compareTo(BigDecimal.ZERO) < 0) {
            taxableIncome = BigDecimal.ZERO;
        }
        
        // Tính thuế thu nhập cá nhân theo bậc thuế lũy tiến (tính trên taxableIncome)
        BigDecimal personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);

        BigDecimal totalDeductions = socialInsurance
                .add(healthInsurance)
                .add(unemploymentInsurance)
                .add(personalIncomeTax);

        BigDecimal netSalary = grossSalary.subtract(totalDeductions);

        CalculatePayrollResponseDTO response = new CalculatePayrollResponseDTO();
        CalculatePayrollResponseDTO.PayrollData data = new CalculatePayrollResponseDTO.PayrollData();
        
        data.setGrossSalary(grossSalary);
        
        CalculatePayrollResponseDTO.Deductions deductions = new CalculatePayrollResponseDTO.Deductions();
        deductions.setSocialInsurance(socialInsurance);
        deductions.setHealthInsurance(healthInsurance);
        deductions.setUnemploymentInsurance(unemploymentInsurance);
        deductions.setPersonalIncomeTax(personalIncomeTax);
        
        data.setDeductions(deductions);
        data.setTotalDeductions(totalDeductions);
        data.setNetSalary(netSalary);
        
        response.setData(data);
        response.setSuccess(true);
        response.setMessage("Payroll calculated successfully");

        return response;
    }

    public UpdatePayrollStatusResponseDTO updatePayrollStatusById(String id, String status) {
        Long payrollId = Long.parseLong(id);
        payrollValidator.validatePayrollId(payrollId);
        
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> ErrorCode.PAYROLL_NOT_FOUND.toException("Payroll không tồn tại với ID: " + id));

        try {
            PayrollStatus statusEnum = PayrollStatus.valueOf(status.toUpperCase());
            payrollValidator.validateStatusTransition(payroll.getStatus(), statusEnum);
            payroll.setStatus(statusEnum);
            payrollRepository.save(payroll);
        } catch (IllegalArgumentException e) {
            throw ErrorCode.INVALID_PAYROLL_STATUS_VALUE.toException("Trạng thái không hợp lệ: " + status);
        }

        UpdatePayrollStatusResponseDTO response = new UpdatePayrollStatusResponseDTO();
        UpdatePayrollStatusResponseDTO.PayrollStatusData data = new UpdatePayrollStatusResponseDTO.PayrollStatusData();
        data.setId(id);
        data.setStatus(status);
        
        response.setData(data);
        response.setSuccess(true);
        response.setMessage("Payroll status updated to " + status);

        return response;
    }


    /**
     * Tính toán Payroll cho Accountant
     * Tất cả các field đều tự nhập từ request
     * 
     * @param request Request chứa tất cả thông tin (fullName, baseSalary, otHours, dayOff, lateDay, allowance, deduction, bonus)
     * @return Response với đầy đủ thông tin tính toán
     */
    public PayrollCalculationForAccountantResponseDTO calculatePayrollForAccountant(
            PayrollCalculationForAccountantRequestDTO request) {

        // Lấy Employee để có cả id (Long) và employeeId (String)
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + request.getEmployeeId()));

        // Tạo response
        PayrollCalculationForAccountantResponseDTO response = new PayrollCalculationForAccountantResponseDTO();

        // Lấy tất cả giá trị từ request (tự nhập)
        response.setFullName(request.getFullName());
        response.setBaseSalary(request.getBaseSalary());
        response.setOtHours(request.getOtHours() != null ? request.getOtHours() : BigDecimal.ZERO);
        
        // dayOff: Luôn tự động tính từ attendance + onLeave (total_days_onleave)
        // dayOff = tổng dayOff từ attendance + tổng total_days_onleave từ onLeave (chỉ tính các đơn đã APPROVED)
        String calculatedDayOff = attendanceService.calculateTotalDayOff(request.getEmployeeId());
        response.setDayOff(calculatedDayOff);
        
        // lateDay: Tự động tính từ attendance
        String calculatedLateDay = attendanceService.calculateLateDay(request.getEmployeeId());
        response.setLateDay(calculatedLateDay);
        
        response.setAllowance(request.getAllowance() != null ? request.getAllowance() : BigDecimal.ZERO);
        response.setGeneralDeductions(request.getGeneralDeductions() != null ? request.getGeneralDeductions() : BigDecimal.ZERO);
        response.setBonus(request.getBonus() != null ? request.getBonus() : BigDecimal.ZERO);
        
        // Tính otPay từ otHours (100,000 VND/giờ)
        BigDecimal otPay = BigDecimal.ZERO;
        if (response.getOtHours() != null && response.getOtHours().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal otRatePerHour = new BigDecimal("100000");
            otPay = response.getOtHours().multiply(otRatePerHour);
        }
        
        // Tính grossIncome = baseSalary + allowance + otPay + bonus
        BigDecimal baseSalary = response.getBaseSalary() != null ? response.getBaseSalary() : BigDecimal.ZERO;
        BigDecimal grossIncome = baseSalary
                .add(response.getAllowance())
                .add(otPay)
                .add(response.getBonus());
        response.setGrossIncome(grossIncome);
        
        // Tính các khoản bảo hiểm (tính trên baseSalary)
        BigDecimal socialInsurance = baseSalary
                .multiply(new BigDecimal("0.08"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
        response.setSocialInsurance(socialInsurance);
        
        BigDecimal healthInsurance = baseSalary
                .multiply(new BigDecimal("0.015"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
        response.setHealthInsurance(healthInsurance);
        
        BigDecimal unemploymentInsurance = baseSalary
                .multiply(new BigDecimal("0.01"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
        response.setUnemploymentInsurance(unemploymentInsurance);
        
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
        
        // Tính thuế thu nhập cá nhân (tính trên taxableIncome với bậc thuế lũy tiến)
        BigDecimal personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);
        response.setPersonalIncomeTax(personalIncomeTax);
        
        // Tính totalDeductions = socialInsurance + healthInsurance + unemploymentInsurance + personalIncomeTax + generalDeductions
        BigDecimal generalDeductions = response.getGeneralDeductions() != null ? response.getGeneralDeductions() : BigDecimal.ZERO;
        BigDecimal totalDeductions = socialInsurance
                .add(healthInsurance)
                .add(unemploymentInsurance)
                .add(personalIncomeTax)
                .add(generalDeductions);
        response.setTotalDeductions(totalDeductions);
        
        // Tính netSalary = grossIncome - totalDeductions
        BigDecimal netSalary = grossIncome.subtract(totalDeductions);
        response.setNetSalary(netSalary);

        // ⚠️ Backend luôn tự động lưu vào database khi tính toán (không có preview mode)
        // ⚠️ FIX: Dùng tháng từ request (nếu có), nếu không thì dùng tháng hiện tại
        // ⚠️ QUAN TRỌNG: Phải dùng final hoặc effectively final để dùng trong lambda
        final String monthToSave = (request.getMonth() != null && !request.getMonth().isEmpty()) 
                ? request.getMonth() 
                : java.time.YearMonth.now().toString(); // Fallback: tháng hiện tại (YYYY-MM)

        // Tìm Payroll theo tháng (period)
        LocalDate periodDate = LocalDate.parse(monthToSave + "-01");
        Payroll payroll = payrollRepository.findAll().stream()
                .filter(p -> p.getPeriod() != null && p.getPeriod().toString().startsWith(monthToSave))
                .findFirst()
                .orElse(null);

        // Nếu chưa có Payroll cho tháng này, tạo mới
        if (payroll == null) {
            payroll = new Payroll();
            payroll.setCode("PAYROLL-" + monthToSave);
            payroll.setPeriod(periodDate);
            payroll.setCreatedDate(LocalDate.now());
            payroll.setStatus(PayrollStatus.PENDING);
            payroll = payrollRepository.save(payroll);
        }

        // Tìm Salary record hiện có của employee trong payroll này
        final Payroll finalPayroll = payroll;
        Salary existingSalary = salaryRepository.findAll().stream()
                .filter(s -> s.getEmployee() != null &&
                        s.getEmployee().getId().equals(employee.getId()) &&
                        s.getPayroll() != null &&
                        s.getPayroll().getId().equals(finalPayroll.getId()))
                .findFirst()
                .orElse(null);

        // Tạo hoặc update Salary record
        Salary salary = existingSalary != null ? existingSalary : new Salary();
        salary.setEmployee(employee);
        salary.setPayroll(payroll);
        salary.setBaseSalary(baseSalary);
        salary.setAllowance(response.getAllowance());
        salary.setOtPay(otPay);
        salary.setBonus(response.getBonus());
        salary.setGrossIncome(grossIncome);
        salary.setSocialInsurance(socialInsurance);
        salary.setHealthInsurance(healthInsurance);
        salary.setUnemploymentInsurance(unemploymentInsurance);
        salary.setTotalInsurance(socialInsurance.add(healthInsurance).add(unemploymentInsurance));
        salary.setGeneralDeductions(generalDeductions);
        salary.setPersonalIncomeTax(personalIncomeTax);
        salary.setTotalDeductions(totalDeductions);
        salary.setNetSalary(netSalary);
        salary.setStatus(management.member.demo.enums.SalaryStatus.AWAITING);
        
        // ⚠️ FIX: Set payment_date để tránh lỗi NOT NULL constraint
        // Nếu status là SUCCESS/PAID, set payment_date = current date
        // Nếu status là AWAITING/PENDING, set payment_date = current date (ngày tính lương)
        if (salary.getStatus() == management.member.demo.enums.SalaryStatus.SUCCESS) {
            salary.setPaymentDate(LocalDate.now()); // Đã thanh toán
        } else {
            // Set payment_date = current date (ngày tính lương) để tránh lỗi NOT NULL
            salary.setPaymentDate(LocalDate.now());
        }

        salaryRepository.save(salary);

        return response;
    }

    /**
     * Lấy thông tin Payroll Calculation cho Accountant
     * Lấy từ Salary entity và tính toán các giá trị cần thiết
     * 
     * @param employeeId ID của nhân viên
     * @return Response với đầy đủ thông tin tính toán
     */
    public GetPayrollCalculationForAccountantResponseDTO getPayrollCalculationForAccountant(Long employeeId) {
        // Lấy employee
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
        
        // Lấy salary mới nhất của employee
        // Query có thể trả về nhiều kết quả nếu có cùng paymentDate, nên lấy phần tử đầu tiên
        List<Salary> salaries = salaryRepository.findFirstByEmployeeIdOrderByPayrollPaymentDateDesc(employeeId);
        if (salaries.isEmpty()) {
            throw ErrorCode.SALARY_NOT_FOUND.toException("Không tìm thấy bản ghi lương cho nhân viên ID: " + employeeId);
        }
        Salary salary = salaries.get(0); // Lấy record đầu tiên (đã sắp xếp theo paymentDate DESC, id DESC)
        
        // Kiểm tra salary có payroll không
        if (salary.getPayroll() == null || salary.getPayroll().getPeriod() == null) {
            throw ErrorCode.INVALID_SALARY.toException("Bản ghi lương không có thông tin payroll hợp lệ cho nhân viên ID: " + employeeId);
        }
        
        // Tạo response
        GetPayrollCalculationForAccountantResponseDTO response = new GetPayrollCalculationForAccountantResponseDTO();
        
        // Lấy thông tin cơ bản
        response.setFullName(employee.getFullName() != null ? employee.getFullName() : "");
        response.setBaseSalary(employee.getBaseSalary() != null ? employee.getBaseSalary() : BigDecimal.ZERO);
        
        // Tính otHours từ OverTime entity (tổng số giờ OT đã approved trong tháng của payroll)
        YearMonth yearMonth = YearMonth.from(salary.getPayroll().getPeriod());
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        BigDecimal totalOtHours = BigDecimal.ZERO;
        List<OverTime> overtimes = overTimeRepository.findAll().stream()
                .filter(ot -> ot.getEmployee() != null && 
                        ot.getEmployee().getId().equals(employee.getId()) &&
                        ot.getOtDate() != null &&
                        !ot.getOtDate().isBefore(startDate) &&
                        !ot.getOtDate().isAfter(endDate) &&
                        ot.getOvertimeStatus() == OverTimeStatus.APPROVED)
                .collect(Collectors.toList());
        
        totalOtHours = overtimes.stream()
                .map(ot -> BigDecimal.valueOf(ot.getOtHours() != null ? ot.getOtHours() : 0.0))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setOtHours(totalOtHours);
        
        response.setAllowance(salary.getAllowance() != null ? salary.getAllowance() : BigDecimal.ZERO);
        response.setBonus(salary.getBonus() != null ? salary.getBonus() : BigDecimal.ZERO);
        
        // Tính otPay từ otHours (đồng bộ với otHours từ OverTime)
        // Công thức: otPay = otHours * 100,000 VND/giờ
        BigDecimal otPay = BigDecimal.ZERO;
        if (totalOtHours != null && totalOtHours.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal otRatePerHour = new BigDecimal("100000");
            otPay = totalOtHours.multiply(otRatePerHour).setScale(2, java.math.RoundingMode.HALF_UP);
        }
        response.setOtPay(otPay);
        
        // Tính grossIncome = baseSalary + bonus + allowance + otPay
        BigDecimal baseSalary = response.getBaseSalary();
        BigDecimal bonus = response.getBonus();
        BigDecimal allowance = response.getAllowance();
        
        BigDecimal grossIncome = baseSalary
                .add(bonus)
                .add(allowance)
                .add(otPay);
        response.setGrossIncome(grossIncome);
        
        // Tính các khoản bảo hiểm (tính trên baseSalary)
        BigDecimal socialInsurance = baseSalary
                .multiply(new BigDecimal("0.08"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
        response.setSocialInsurance(socialInsurance);
        
        BigDecimal healthInsurance = baseSalary
                .multiply(new BigDecimal("0.015"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
        response.setHealthInsurance(healthInsurance);
        
        BigDecimal unemploymentInsurance = baseSalary
                .multiply(new BigDecimal("0.01"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
        response.setUnemploymentInsurance(unemploymentInsurance);
        
        // Lấy generalDeductions
        BigDecimal generalDeductions = salary.getGeneralDeductions() != null ? salary.getGeneralDeductions() : BigDecimal.ZERO;
        response.setGeneralDeductions(generalDeductions);
        
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
        
        // Tính thuế thu nhập cá nhân (tính trên taxableIncome)
        BigDecimal personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);
        response.setPersonalIncomeTax(personalIncomeTax);
        
        // Tính totalDeductions = socialInsurance + healthInsurance + unemploymentInsurance + personalIncomeTax + generalDeductions
        BigDecimal totalDeductions = socialInsurance
                .add(healthInsurance)
                .add(unemploymentInsurance)
                .add(personalIncomeTax)
                .add(generalDeductions);
        response.setTotalDeductions(totalDeductions);
        
        // Tính netSalary = grossIncome - totalDeductions
        BigDecimal netSalary = grossIncome.subtract(totalDeductions);
        response.setNetSalary(netSalary);
        
        return response;
    }
    
    /**
     * Tính thuế thu nhập cá nhân theo bậc thuế suất lũy tiến
     */
    private BigDecimal calculatePersonalIncomeTax(BigDecimal taxableIncome) {
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
            return tax.setScale(2, java.math.RoundingMode.HALF_UP);
        }
        
        // Bậc 2: 5 – 10 triệu: 10%
        if (remaining.compareTo(new BigDecimal("5000000")) > 0) {
            BigDecimal amount = new BigDecimal("5000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.10")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.10")));
            return tax.setScale(2, java.math.RoundingMode.HALF_UP);
        }
        
        // Bậc 3: 10 – 18 triệu: 15%
        if (remaining.compareTo(new BigDecimal("8000000")) > 0) {
            BigDecimal amount = new BigDecimal("8000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.15")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.15")));
            return tax.setScale(2, java.math.RoundingMode.HALF_UP);
        }
        
        // Bậc 4: 18 – 32 triệu: 20%
        if (remaining.compareTo(new BigDecimal("14000000")) > 0) {
            BigDecimal amount = new BigDecimal("14000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.20")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.20")));
            return tax.setScale(2, java.math.RoundingMode.HALF_UP);
        }
        
        // Bậc 5: 32 – 52 triệu: 25%
        if (remaining.compareTo(new BigDecimal("20000000")) > 0) {
            BigDecimal amount = new BigDecimal("20000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.25")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.25")));
            return tax.setScale(2, java.math.RoundingMode.HALF_UP);
        }
        
        // Bậc 6: 52 – 80 triệu: 30%
        if (remaining.compareTo(new BigDecimal("28000000")) > 0) {
            BigDecimal amount = new BigDecimal("28000000");
            tax = tax.add(amount.multiply(new BigDecimal("0.30")));
            remaining = remaining.subtract(amount);
        } else {
            tax = tax.add(remaining.multiply(new BigDecimal("0.30")));
            return tax.setScale(2, java.math.RoundingMode.HALF_UP);
        }
        
        // Bậc 7: Trên 80 triệu: 35%
        if (remaining.compareTo(BigDecimal.ZERO) > 0) {
            tax = tax.add(remaining.multiply(new BigDecimal("0.35")));
        }
        
        return tax.setScale(2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Lấy bảng lương hàng tháng của nhân viên cho Accountant
     * @param month Tháng cần lấy (format: "YYYY-MM", ví dụ: "2025-01")
     * @return Danh sách bảng lương với thông tin đầy đủ
     */
    public List<MonthlyPayrollForAccountantDTO> getMonthlyPayrollForAccountant(String month) {
        // Lấy tất cả salary records
        List<Salary> salaries = salaryRepository.findAll();
        
        // Filter theo tháng nếu có
        if (month != null && !month.isEmpty()) {
            salaries = salaries.stream()
                    .filter(s -> s.getPayroll() != null && 
                            s.getPayroll().getPeriod() != null &&
                            s.getPayroll().getPeriod().toString().startsWith(month))
                    .collect(Collectors.toList());
        }
        
        // Lấy tất cả employees để map thông tin
        List<Employee> employees = employeeRepository.findAll();
        java.util.Map<Long, Employee> employeeMap = employees.stream()
                .collect(Collectors.toMap(Employee::getId, e -> e));
        
        // Map sang DTO
        return salaries.stream()
                .filter(s -> s.getPayroll() != null && s.getPayroll().getPeriod() != null) // Chỉ lấy salary có payroll và period hợp lệ
                .map(salary -> {
                    MonthlyPayrollForAccountantDTO dto = new MonthlyPayrollForAccountantDTO();
                    
                    // ⚠️ QUAN TRỌNG: Set payrollId và salaryId để frontend có thể gọi API pay/cancel
                    dto.setPayrollId(salary.getPayroll() != null ? salary.getPayroll().getId() : null);
                    dto.setSalaryId(salary.getId());
                    
                    // Lấy thông tin từ Employee
                    Long empId = salary.getEmployee() != null ? salary.getEmployee().getId() : null;
                    Employee employee = empId != null ? employeeMap.get(empId) : null;
                    if (employee != null) {
                        dto.setFullName(employee.getFullName() != null ? employee.getFullName() : "");
                        dto.setEmail(employee.getEmail() != null ? employee.getEmail() : "");
                        dto.setDepartment(employee.getDepartment() != null ? employee.getDepartment() : "");
                    }
                    
                    // Tính otHours từ OverTime entity (tổng số giờ OT đã approved trong tháng)
                    YearMonth yearMonth = YearMonth.from(salary.getPayroll().getPeriod());
                    LocalDate startDate = yearMonth.atDay(1);
                    LocalDate endDate = yearMonth.atEndOfMonth();
                    
                    BigDecimal totalOtHours = BigDecimal.ZERO;
                    if (employee != null) {
                        List<OverTime> overtimes = overTimeRepository.findAll().stream()
                                .filter(ot -> ot.getEmployee() != null && 
                                        ot.getEmployee().getId().equals(employee.getId()) &&
                                        ot.getOtDate() != null &&
                                        !ot.getOtDate().isBefore(startDate) &&
                                        !ot.getOtDate().isAfter(endDate) &&
                                        ot.getOvertimeStatus() == OverTimeStatus.APPROVED)
                                .collect(Collectors.toList());
                        
                        totalOtHours = overtimes.stream()
                                .map(ot -> BigDecimal.valueOf(ot.getOtHours() != null ? ot.getOtHours() : 0.0))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                    }
                    dto.setOtHours(totalOtHours);
                    
                    // Tính otPay từ otHours (đồng bộ với otHours từ OverTime)
                    // Công thức: otPay = otHours * 100,000 VND/giờ
                    BigDecimal otPay = BigDecimal.ZERO;
                    if (totalOtHours != null && totalOtHours.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal otRatePerHour = new BigDecimal("100000");
                        otPay = totalOtHours.multiply(otRatePerHour).setScale(2, java.math.RoundingMode.HALF_UP);
                    }
                    dto.setOtPay(otPay);
                    // ⚠️ FIX: Lấy baseSalary từ Salary entity (đã lưu) thay vì từ Employee entity
                    // Ưu tiên: salary.getBaseSalary() > employee.getBaseSalary() > 0
                    dto.setBaseSalary(salary.getBaseSalary() != null ? salary.getBaseSalary() : 
                            (employee != null && employee.getBaseSalary() != null ? employee.getBaseSalary() : BigDecimal.ZERO));
                    dto.setNetSalary(salary.getNetSalary() != null ? salary.getNetSalary() : BigDecimal.ZERO);
                    
                    // ⚠️ FIX: Lấy status từ Salary entity (status của bản ghi lương cụ thể) thay vì từ Payroll entity
                    // SalaryStatus: AWAITING, SUCCESS, CANCELLED, FAILED
                    // PayrollStatus: PENDING, PAID, CANCELLED, FAILED
                    // Frontend cần biết status của từng bản ghi lương (Salary), không phải status của toàn bộ Payroll
                    if (salary.getStatus() != null) {
                        // Map SalaryStatus sang PayrollStatus để frontend hiển thị đúng
                        // SalaryStatus.SUCCESS -> PayrollStatus.PAID
                        // SalaryStatus.AWAITING -> PayrollStatus.PENDING (vì PayrollStatus không có AWAITING)
                        // SalaryStatus.CANCELLED -> PayrollStatus.CANCELLED
                        // SalaryStatus.FAILED -> PayrollStatus.FAILED
                        if (salary.getStatus() == management.member.demo.enums.SalaryStatus.SUCCESS) {
                            dto.setStatus(PayrollStatus.PAID);
                        } else if (salary.getStatus() == management.member.demo.enums.SalaryStatus.AWAITING) {
                            dto.setStatus(PayrollStatus.PENDING);
                        } else if (salary.getStatus() == management.member.demo.enums.SalaryStatus.CANCELLED) {
                            dto.setStatus(PayrollStatus.CANCELLED);
                        } else if (salary.getStatus() == management.member.demo.enums.SalaryStatus.FAILED) {
                            dto.setStatus(PayrollStatus.FAILED);
                        } else {
                            // Fallback: dùng Payroll status nếu Salary status không khớp
                            dto.setStatus(salary.getPayroll() != null && salary.getPayroll().getStatus() != null ? 
                                    salary.getPayroll().getStatus() : PayrollStatus.PENDING);
                        }
                    } else {
                        // Nếu Salary không có status, fallback về Payroll status
                        dto.setStatus(salary.getPayroll() != null && salary.getPayroll().getStatus() != null ? 
                                salary.getPayroll().getStatus() : PayrollStatus.PENDING);
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
}

