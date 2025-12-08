package management.member.demo.service;

import management.member.demo.dto.DashboardPayrollStatisticsDTO;
import management.member.demo.dto.EmployeeByDepartmentStatisticsDTO;
import management.member.demo.dto.EmployeeStatisticsDTO;
import management.member.demo.dto.MonthlyPayrollDTO;
import management.member.demo.dto.PayrollByDepartmentDTO;
import management.member.demo.dto.PayrollStatisticsDTO;
import management.member.demo.dto.WaitingPayrollListDTO;
import management.member.demo.dto.WeeklyAttendanceStatisticsDTO;
import management.member.demo.entity.Attendance;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.entity.OnLeave;
import management.member.demo.entity.Payroll;
import management.member.demo.entity.Salary;
import management.member.demo.enums.AttendenceStatus;
import management.member.demo.enums.BenefitsStatus;
import management.member.demo.enums.EmployeeStatus;
import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.enums.PayrollStatus;
import management.member.demo.repository.*;
import management.member.demo.repository.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class PayrollStatisticsService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeBenefitsRepository employeeBenefitsRepository;

    @Autowired
    private OnLeaveRepository onLeaveRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    /**
     * Tổng lương thực lĩnh của tất cả nhân viên có trạng thái payroll là PAID (tháng hiện tại)
     * ⚠️ FIX: Filter theo period (tháng lương) thay vì paymentDate (ngày thanh toán)
     */
    public BigDecimal getTotalPayroll() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // ⚠️ FIX: Lấy tất cả payroll có status PAID và period (tháng lương) trong tháng hiện tại
        // Không dùng paymentDate vì có thể thanh toán lương tháng trước vào tháng này
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPeriod() != null
                        && YearMonth.from(p.getPeriod()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này và tính tổng netSalary
        return paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .map(salary -> salary.getNetSalary() != null ? salary.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Đếm những payroll có trạng thái PENDING (tháng hiện tại)
     * ⚠️ FIX: Filter theo period (tháng lương) thay vì paymentDate
     */
    public Long getPendingPayroll() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        return payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PENDING
                        && p.getPeriod() != null
                        && YearMonth.from(p.getPeriod()).equals(currentMonth))
                .count();
    }

    /**
     * Tổng của các tổng chi của các phúc lợi có trạng thái active (tháng hiện tại)
     * Chỉ tính cho nhân viên có payroll PAID trong tháng hiện tại
     * ⚠️ FIX: Filter theo period (tháng lương) thay vì paymentDate
     */
    public BigDecimal getAllowanceTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // ⚠️ FIX: Lấy tất cả payroll có status PAID và period (tháng lương) trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPeriod() != null
                        && YearMonth.from(p.getPeriod()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả employeeId từ các payroll này
        List<Long> employeeIds = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .map(s -> s.getEmployee() != null ? s.getEmployee().getId() : null)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());
        
        // Lấy tất cả EmployeeBenefits có status ACTIVE của các nhân viên này
        List<EmployeeBenefits> activeBenefits = employeeBenefitsRepository.findAll().stream()
                .filter(b -> b.getStatus() == BenefitsStatus.ACTIVE
                        && b.getEmployeeId() != null
                        && employeeIds.stream().anyMatch(id -> 
                            b.getEmployeeId().equals(String.valueOf(id)) || 
                            (id != null && b.getEmployeeId().equals(id.toString()))))
                .collect(Collectors.toList());
        
        // Tính tổng allowanceAmount từ Benefits entity
        BigDecimal total = BigDecimal.ZERO;
        for (EmployeeBenefits employeeBenefit : activeBenefits) {
            if (employeeBenefit.getBenefit() != null && 
                employeeBenefit.getBenefit().getAllowanceAmount() != null) {
                total = total.add(employeeBenefit.getBenefit().getAllowanceAmount());
            }
        }
        return total;
    }

    /**
     * Tổng lương cơ bản của tất cả nhân viên đang active và payroll có trạng thái PAID (tháng hiện tại)
     * ⚠️ FIX: Filter theo period (tháng lương) thay vì paymentDate
     */
    public BigDecimal getBasicSalaryTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // ⚠️ FIX: Lấy tất cả payroll có status PAID và period (tháng lương) trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPeriod() != null
                        && YearMonth.from(p.getPeriod()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE và tính tổng baseSalary từ Employee
        return salaries.stream()
                .filter(salary -> {
                    if (salary.getEmployee() == null) return false;
                    Employee employee = employeeRepository.findById(salary.getEmployee().getId()).orElse(null);
                    return employee != null && employee.getStatus() == EmployeeStatus.ACTIVE;
                })
                .map(salary -> {
                    Employee employee = employeeRepository.findById(salary.getEmployee().getId()).orElse(null);
                    return employee != null && employee.getBaseSalary() != null ? employee.getBaseSalary() : BigDecimal.ZERO;
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Lương cơ bản của từng nhân viên + phụ cấp cố định * 21.5% trần là 36tr trên từng nhân viên rồi tổng tất cả lại (tháng hiện tại)
     * Chỉ tính cho nhân viên có payroll PAID trong tháng hiện tại
     * ⚠️ FIX: Filter theo period (tháng lương) thay vì paymentDate
     */
    public BigDecimal getInsuranceTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // ⚠️ FIX: Lấy tất cả payroll có status PAID và period (tháng lương) trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPeriod() != null
                        && YearMonth.from(p.getPeriod()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE
        List<Salary> activeSalaries = salaries.stream()
                .filter(salary -> {
                    Employee employee = salary.getEmployee() != null ? 
                        employeeRepository.findById(salary.getEmployee().getId()).orElse(null) : null;
                    return employee != null && employee.getStatus() == EmployeeStatus.ACTIVE;
                })
                .collect(Collectors.toList());
        
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal maxInsuranceBase = new BigDecimal("36000000"); // 36 triệu
        BigDecimal insuranceRate = new BigDecimal("0.215"); // 21.5%
        
        for (Salary salary : activeSalaries) {
            // Lấy baseSalary từ Employee
            Employee employee = salary.getEmployee() != null ? 
                employeeRepository.findById(salary.getEmployee().getId()).orElse(null) : null;
            BigDecimal baseSalary = employee != null && employee.getBaseSalary() != null ? employee.getBaseSalary() : BigDecimal.ZERO;
            
            // Lấy phụ cấp cố định từ salary
            BigDecimal fixedAllowance = salary.getAllowance() != null ? salary.getAllowance() : BigDecimal.ZERO;
            
            // Tính: (baseSalary + fixedAllowance) * 21.5%, tối đa 36tr
            BigDecimal insuranceBase = baseSalary.add(fixedAllowance);
            BigDecimal insuranceAmount = insuranceBase.multiply(insuranceRate);
            
            // Trần 36tr
            if (insuranceAmount.compareTo(maxInsuranceBase) > 0) {
                insuranceAmount = maxInsuranceBase;
            }
            
            total = total.add(insuranceAmount);
        }
        
        return total;
    }

    /**
     * Tổng otPay của tất cả nhân viên có trạng thái hoạt động và payroll có trạng thái PAID (tháng hiện tại)
     * ⚠️ FIX: Filter theo period (tháng lương) thay vì paymentDate
     */
    public BigDecimal getOvertimeTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // ⚠️ FIX: Lấy tất cả payroll có status PAID và period (tháng lương) trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPeriod() != null
                        && YearMonth.from(p.getPeriod()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE và tính tổng otPay
        return salaries.stream()
                .filter(salary -> {
                    Employee employee = salary.getEmployee() != null ? 
                        employeeRepository.findById(salary.getEmployee().getId()).orElse(null) : null;
                    return employee != null && employee.getStatus() == EmployeeStatus.ACTIVE;
                })
                .map(salary -> salary.getOtPay() != null ? salary.getOtPay() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Tổng thuế thu nhập cá nhân (personalIncomeTax) của tất cả nhân viên có trạng thái hoạt động và payroll có trạng thái PAID (tháng hiện tại)
     * ⚠️ FIX: Filter theo period (tháng lương) thay vì paymentDate
     */
    public BigDecimal getTotalTax() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // ⚠️ FIX: Lấy tất cả payroll có status PAID và period (tháng lương) trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPeriod() != null
                        && YearMonth.from(p.getPeriod()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE và tính tổng personalIncomeTax
        return salaries.stream()
                .filter(salary -> {
                    Employee employee = salary.getEmployee() != null ? 
                        employeeRepository.findById(salary.getEmployee().getId()).orElse(null) : null;
                    return employee != null && employee.getStatus() == EmployeeStatus.ACTIVE;
                })
                .map(salary -> salary.getPersonalIncomeTax() != null ? salary.getPersonalIncomeTax() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Tổng bonus của tất cả nhân viên có trạng thái hoạt động và payroll có trạng thái PAID (tháng hiện tại)
     * ⚠️ FIX: Filter theo period (tháng lương) thay vì paymentDate
     */
    public BigDecimal getBonusTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // ⚠️ FIX: Lấy tất cả payroll có status PAID và period (tháng lương) trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPeriod() != null
                        && YearMonth.from(p.getPeriod()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE và tính tổng bonus
        return salaries.stream()
                .filter(salary -> {
                    Employee employee = salary.getEmployee() != null ? 
                        employeeRepository.findById(salary.getEmployee().getId()).orElse(null) : null;
                    return employee != null && employee.getStatus() == EmployeeStatus.ACTIVE;
                })
                .map(salary -> salary.getBonus() != null ? salary.getBonus() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Total Chi phí bảo hiểm + totalAllPhụ cấp + totalBonus
     */
    public BigDecimal getDeductionTotal() {
        BigDecimal insuranceTotal = getInsuranceTotal();
        BigDecimal allowanceTotal = getAllowanceTotal();
        BigDecimal bonusTotal = getBonusTotal();
        
        return insuranceTotal.add(allowanceTotal).add(bonusTotal);
    }

    /**
     * (Tổng lương tháng này - Tổng lương tháng trước) / Tổng lương tháng trước * 100
     */
    public BigDecimal getPayrollGrowth() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        YearMonth lastMonth = currentMonth.minusMonths(1);
        
        // Tính tổng lương tháng này
        BigDecimal currentMonthTotal = getTotalPayrollByMonth(currentMonth);
        
        // Tính tổng lương tháng trước
        BigDecimal lastMonthTotal = getTotalPayrollByMonth(lastMonth);
        
        if (lastMonthTotal.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        // (currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100
        BigDecimal difference = currentMonthTotal.subtract(lastMonthTotal);
        BigDecimal growth = difference.divide(lastMonthTotal, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
        
        return growth;
    }

    /**
     * Danh sách payroll đang chờ thanh toán
     */
    public List<WaitingPayrollListDTO> getWaitingPayrollList() {
        // Lấy tất cả payroll có status PENDING
        List<Payroll> pendingPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PENDING)
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = pendingPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Map sang DTO
        return salaries.stream()
                .map(salary -> {
                    Employee employee = salary.getEmployee() != null ? 
                        employeeRepository.findById(salary.getEmployee().getId()).orElse(null) : null;
                    
                    WaitingPayrollListDTO dto = new WaitingPayrollListDTO();
                    // Set employeeId (ưu tiên employeeId từ Employee, nếu không có thì dùng id)
                    if (employee != null && employee.getEmployeeId() != null) {
                        dto.setEmployeeId(employee.getEmployeeId());
                    } else if (employee != null) {
                        dto.setEmployeeId(String.valueOf(employee.getId()));
                    } else {
                        dto.setEmployeeId(String.valueOf(salary.getEmployee() != null ? salary.getEmployee().getId() : null));
                    }
                    dto.setFirstName(employee != null && employee.getFirstName() != null 
                            ? employee.getFirstName() 
                            : (employee != null && employee.getFullName() != null 
                                    ? employee.getFullName().split(" ")[0] 
                                    : ""));
                    dto.setDepartment(employee != null && employee.getDepartment() != null 
                            ? employee.getDepartment() 
                            : "");
                    dto.setNetSalary(salary.getNetSalary() != null ? salary.getNetSalary() : BigDecimal.ZERO);
                    dto.setStatus(PayrollStatus.PENDING);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Tổng lương thực lĩnh của tất cả nhân viên trong từng tháng, dựa trên tháng của paymentDate
     */
    public BigDecimal getTotalPayrollByMonth(YearMonth month) {
        // Lấy tất cả payroll có paymentDate trong tháng này
        List<Payroll> payrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(month))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này và tính tổng netSalary
        return payrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .map(salary -> salary.getNetSalary() != null ? salary.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Danh sách tổng lương theo tháng
     */
    public List<MonthlyPayrollDTO> getMonthlyPayroll() {
        // Lấy tất cả payroll có status PAID
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID && p.getPaymentDate() != null)
                .collect(Collectors.toList());
        
        // Nhóm theo tháng
        Map<YearMonth, List<Payroll>> payrollsByMonth = paidPayrolls.stream()
                .collect(Collectors.groupingBy(p -> YearMonth.from(p.getPaymentDate())));
        
        // Tính tổng cho từng tháng
        // Sắp xếp theo YearMonth giảm dần trước (chuẩn ISO: YYYY-MM)
        List<Map.Entry<YearMonth, List<Payroll>>> sortedEntries = payrollsByMonth.entrySet().stream()
                .sorted((a, b) -> b.getKey().compareTo(a.getKey())) // Giảm dần theo YearMonth
                .collect(Collectors.toList());
        
        List<MonthlyPayrollDTO> result = new ArrayList<>();
        for (Map.Entry<YearMonth, List<Payroll>> entry : sortedEntries) {
            YearMonth yearMonth = entry.getKey(); // Backend lưu YearMonth (YYYY-MM) - chuẩn ISO
            List<Payroll> payrolls = entry.getValue();
            
            BigDecimal total = payrolls.stream()
                    .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                    .map(salary -> salary.getNetSalary() != null ? salary.getNetSalary() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            MonthlyPayrollDTO dto = new MonthlyPayrollDTO();
            // Convert YearMonth (YYYY-MM) → "T1", "T2", ... "T12" cho FE
            int monthValue = yearMonth.getMonthValue();
            dto.setMonth("T" + monthValue);
            dto.setTotalPayroll(total);
            result.add(dto);
        }
        
        return result;
    }

    /**
     * Tổng lương thực lĩnh (netSalary) của tất cả nhân viên thuộc phòng ban đó, với payroll tháng này có trạng thái PAID
     * ⚠️ FIX: Filter theo period (tháng lương) thay vì paymentDate
     */
    public BigDecimal getTotalPayrollEmployeeByDepartment(String department) {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // ⚠️ FIX: Lấy tất cả payroll có status PAID và period (tháng lương) trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPeriod() != null
                        && YearMonth.from(p.getPeriod()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên thuộc department và tính tổng netSalary
        return salaries.stream()
                .filter(salary -> {
                    Employee employee = salary.getEmployee() != null ? 
                        employeeRepository.findById(salary.getEmployee().getId()).orElse(null) : null;
                    return employee != null 
                            && employee.getDepartment() != null 
                            && employee.getDepartment().equals(department);
                })
                .map(salary -> salary.getNetSalary() != null ? salary.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Danh sách tổng lương theo phòng ban
     */
    public List<PayrollByDepartmentDTO> getPayrollByDepartment() {
        // Lấy tất cả departments từ employees
        List<String> departments = employeeRepository.findAll().stream()
                .map(Employee::getDepartment)
                .filter(dept -> dept != null && !dept.isEmpty())
                .distinct()
                .collect(Collectors.toList());
        
        // Tính tổng lương cho từng department
        return departments.stream()
                .map(dept -> {
                    PayrollByDepartmentDTO dto = new PayrollByDepartmentDTO();
                    dto.setDepartment(dept);
                    dto.setTotalPayrollEmployeeByDepartment(getTotalPayrollEmployeeByDepartment(dept));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Lấy tất cả thống kê payroll
     */
    public PayrollStatisticsDTO getAllPayrollStatistics() {
        PayrollStatisticsDTO stats = new PayrollStatisticsDTO();
        
        stats.setTotalPayroll(getTotalPayroll());
        stats.setPendingPayroll(getPendingPayroll());
        stats.setAllowanceTotal(getAllowanceTotal());
        stats.setBasicSalaryTotal(getBasicSalaryTotal());
        stats.setInsuranceTotal(getInsuranceTotal());
        stats.setOvertimeTotal(getOvertimeTotal());
        stats.setBonusTotal(getBonusTotal());
        stats.setDeductionTotal(getDeductionTotal());
        stats.setPayrollGrowth(getPayrollGrowth());
        stats.setWaitingPayrollList(getWaitingPayrollList());
        stats.setMonthlyPayroll(getMonthlyPayroll());
        stats.setPayrollByDepartment(getPayrollByDepartment());
        
        return stats;
    }
    
    /**
     * Lấy tất cả thống kê payroll cho Dashboard
     */
    public DashboardPayrollStatisticsDTO getDashboardPayrollStatistics() {
        DashboardPayrollStatisticsDTO dashboard = new DashboardPayrollStatisticsDTO();
        
        dashboard.setTotalPayroll(getTotalPayroll());
        dashboard.setPendingPayroll(getPendingPayroll());
        dashboard.setPayrollGrowth(getPayrollGrowth());
        dashboard.setBasicSalaryTotal(getBasicSalaryTotal());
        dashboard.setAllowanceTotal(getAllowanceTotal());
        dashboard.setOvertimeTotal(getOvertimeTotal());
        dashboard.setBonusTotal(getBonusTotal());
        dashboard.setDeductionTotal(getDeductionTotal());
        dashboard.setInsuranceTotal(getInsuranceTotal());
        dashboard.setPayrollByDepartment(getPayrollByDepartment());
        dashboard.setMonthlyPayroll(getMonthlyPayroll());
        dashboard.setPendingPayrollList(getWaitingPayrollList());
        
        return dashboard;
    }

    /**
     * Lấy thống kê tổng hợp payroll: totalEmployees, totalPayroll, totalOTPay, totalInsurance, totalTax
     * 
     * @param totalEmployees Tổng số nhân viên (từ EmployeeService)
     * @return Map chứa các thống kê
     */
    public Map<String, Object> getPayrollSummary(Long totalEmployees) {
        Map<String, Object> summary = new HashMap<>();
        
        summary.put("totalEmployees", totalEmployees);
        summary.put("totalPayroll", getTotalPayroll());
        summary.put("totalOTPay", getOvertimeTotal());
        summary.put("totalInsurance", getInsuranceTotal());
        summary.put("totalTax", getTotalTax());
        
        return summary;
    }

    /**
     * Lấy danh sách filter options: selectedDepartment (tất cả phòng ban) và selectedMonth (tất cả tháng có payroll)
     * 
     * @return Map chứa selectedDepartment và selectedMonth
     */
    public Map<String, Object> getFilterOptions() {
        Map<String, Object> filters = new HashMap<>();
        
        // Lấy tất cả phòng ban từ employees
        List<String> departments = employeeRepository.findAll().stream()
                .map(Employee::getDepartment)
                .filter(dept -> dept != null && !dept.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        filters.put("selectedDepartment", departments);
        
        // Lấy tất cả tháng có payroll (từ paymentDate)
        List<String> months = payrollRepository.findAll().stream()
                .filter(p -> p.getPaymentDate() != null && p.getStatus() == PayrollStatus.PAID)
                .map(p -> {
                    YearMonth yearMonth = YearMonth.from(p.getPaymentDate());
                    return yearMonth.toString(); // Format: "YYYY-MM"
                })
                .distinct()
                .sorted((a, b) -> b.compareTo(a)) // Sắp xếp giảm dần (tháng mới nhất trước)
                .collect(Collectors.toList());
        filters.put("selectedMonth", months);
        
        return filters;
    }

    /**
     * Đếm nhân viên có trạng thái hoạt động (ACTIVE)
     * @return Số lượng nhân viên có status = ACTIVE
     */
    public Long countActiveEmployees() {
        return employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
    }

    /**
     * Đếm nhân viên mới được add vào trong tháng (tháng hiện tại)
     * @return Số lượng nhân viên có hireDate trong tháng hiện tại
     */
    public Long countNewEmployeesThisMonth() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        LocalDate firstDayOfMonth = currentMonth.atDay(1);
        LocalDate lastDayOfMonth = currentMonth.atEndOfMonth();
        
        return employeeRepository.findAll().stream()
                .filter(e -> e.getHireDate() != null &&
                        !e.getHireDate().isBefore(firstDayOfMonth) &&
                        !e.getHireDate().isAfter(lastDayOfMonth))
                .count();
    }

    /**
     * Đếm số đơn nghỉ phép (tổng số đơn) và số đơn chờ duyệt (status = PENDING)
     * @return Map chứa totalLeaveRequests (tổng số đơn) và pendingLeaveRequests (số đơn chờ duyệt)
     */
    public Map<String, Long> countLeaveRequests() {
        Map<String, Long> result = new HashMap<>();
        
        // Tổng số đơn nghỉ phép
        long totalLeaveRequests = onLeaveRepository.count();
        result.put("totalLeaveRequests", totalLeaveRequests);
        
        // Số đơn chờ duyệt (status = PENDING)
        long pendingLeaveRequests = onLeaveRepository.countByOnLeaveStatus(OnLeaveStatus.PENDING);
        result.put("pendingLeaveRequests", pendingLeaveRequests);
        
        return result;
    }

    /**
     * Đếm tổng lương thực nhận (netSalary) của tất cả nhân viên trong tháng (tháng hiện tại)
     * Lấy từ Salary entity có payroll với period trong tháng hiện tại
     * @return Tổng netSalary của tất cả nhân viên trong tháng
     */
    public BigDecimal getTotalNetSalaryThisMonth() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // Lấy tất cả payroll có period (tháng lương) trong tháng hiện tại
        List<Payroll> payrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getPeriod() != null &&
                        YearMonth.from(p.getPeriod()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này và tính tổng netSalary
        return payrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .map(salary -> salary.getNetSalary() != null ? salary.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Đếm nhân viên check in đúng giờ trong tháng hiện tại
     * Check in đúng giờ: có checkIn và status = IN_WORK (không phải LATE)
     * @return Số lượng nhân viên check in đúng giờ trong tháng
     */
    public Long countOnTimeCheckInsThisMonth() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        LocalDate firstDayOfMonth = currentMonth.atDay(1);
        LocalDate lastDayOfMonth = currentMonth.atEndOfMonth();
        
        // Lấy tất cả attendance trong tháng
        List<Attendance> attendances = attendanceRepository.findByDateRange(firstDayOfMonth, lastDayOfMonth);
        
        // Đếm số nhân viên có checkIn và status = IN_WORK (không phải LATE)
        return attendances.stream()
                .filter(a -> a.getCheckIn() != null &&
                        a.getStatus() == AttendenceStatus.IN_WORK)
                .map(a -> a.getEmployee() != null ? a.getEmployee().getId() : null)
                .filter(id -> id != null)
                .distinct()
                .count();
    }

    /**
     * Đếm nhân viên check in trễ trong tháng hiện tại
     * Check in trễ: có checkIn và status = LATE
     * @return Số lượng nhân viên check in trễ trong tháng
     */
    public Long countLateCheckInsThisMonth() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        LocalDate firstDayOfMonth = currentMonth.atDay(1);
        LocalDate lastDayOfMonth = currentMonth.atEndOfMonth();
        
        // Lấy tất cả attendance trong tháng
        List<Attendance> attendances = attendanceRepository.findByDateRange(firstDayOfMonth, lastDayOfMonth);
        
        // Đếm số nhân viên có checkIn và status = LATE
        return attendances.stream()
                .filter(a -> a.getCheckIn() != null &&
                        a.getStatus() == AttendenceStatus.LATE)
                .map(a -> a.getEmployee() != null ? a.getEmployee().getId() : null)
                .filter(id -> id != null)
                .distinct()
                .count();
    }

    /**
     * Đếm nhân viên vắng mặt trong tháng hiện tại
     * Vắng mặt: status = NOT_CHECKED_IN hoặc không có attendance record trong ngày làm việc
     * Tính theo số ngày làm việc trong tháng (trừ cuối tuần)
     * @return Số lượng nhân viên vắng mặt (tổng số ngày vắng mặt của tất cả nhân viên)
     */
    public Long countAbsentEmployeesThisMonth() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        LocalDate firstDayOfMonth = currentMonth.atDay(1);
        LocalDate lastDayOfMonth = currentMonth.atEndOfMonth();
        
        // Lấy tất cả nhân viên ACTIVE
        List<Employee> activeEmployees = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
        
        // Lấy tất cả attendance trong tháng
        List<Attendance> attendances = attendanceRepository.findByDateRange(firstDayOfMonth, lastDayOfMonth);
        
        // Tạo map: employeeId -> Set<LocalDate> (các ngày đã có attendance)
        Map<Long, java.util.Set<LocalDate>> employeeAttendanceDates = attendances.stream()
                .filter(a -> a.getEmployee() != null && a.getEmployee().getId() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getEmployee().getId(),
                        Collectors.mapping(
                                Attendance::getAttendanceDate,
                                Collectors.toSet()
                        )
                ));
        
        // Đếm số ngày vắng mặt
        long totalAbsentDays = 0;
        for (Employee employee : activeEmployees) {
            Long employeeId = employee.getId();
            java.util.Set<LocalDate> attendedDates = employeeAttendanceDates.getOrDefault(employeeId, java.util.Collections.emptySet());
            
            // Đếm số ngày làm việc trong tháng (trừ cuối tuần)
            LocalDate dateToCheck = firstDayOfMonth;
            while (!dateToCheck.isAfter(lastDayOfMonth)) {
                // Chỉ tính các ngày trong tuần (Monday-Friday)
                final LocalDate currentDate = dateToCheck; // Make effectively final for lambda
                java.time.DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
                if (dayOfWeek != java.time.DayOfWeek.SATURDAY && dayOfWeek != java.time.DayOfWeek.SUNDAY) {
                    // Nếu không có attendance record hoặc status = NOT_CHECKED_IN
                    if (!attendedDates.contains(currentDate)) {
                        totalAbsentDays++;
                    } else {
                        // Kiểm tra nếu có attendance nhưng status = NOT_CHECKED_IN
                        Attendance attendance = attendances.stream()
                                .filter(a -> a.getEmployee() != null &&
                                        a.getEmployee().getId().equals(employeeId) &&
                                        a.getAttendanceDate().equals(currentDate))
                                .findFirst()
                                .orElse(null);
                        if (attendance != null && attendance.getStatus() == AttendenceStatus.NOT_CHECKED_IN) {
                            totalAbsentDays++;
                        }
                    }
                }
                dateToCheck = dateToCheck.plusDays(1);
            }
        }
        
        return totalAbsentDays;
    }

    /**
     * Tỷ lệ chấm công trung bình trong tháng hiện tại
     * Tỷ lệ = (Số nhân viên đã check in / Tổng số nhân viên ACTIVE) * 100
     * Tính theo số ngày làm việc trong tháng (trừ cuối tuần)
     * @return Tỷ lệ chấm công trung bình (0-100)
     */
    public BigDecimal getAverageAttendanceRateThisMonth() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        LocalDate firstDayOfMonth = currentMonth.atDay(1);
        LocalDate lastDayOfMonth = currentMonth.atEndOfMonth();
        
        // Lấy tất cả nhân viên ACTIVE
        List<Employee> activeEmployees = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
        long totalEmployees = activeEmployees.size();
        
        if (totalEmployees == 0) {
            return BigDecimal.ZERO;
        }
        
        // Đếm số ngày làm việc trong tháng (trừ cuối tuần)
        long workingDays = 0;
        LocalDate currentDate = firstDayOfMonth;
        while (!currentDate.isAfter(lastDayOfMonth)) {
            java.time.DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
            if (dayOfWeek != java.time.DayOfWeek.SATURDAY && dayOfWeek != java.time.DayOfWeek.SUNDAY) {
                workingDays++;
            }
            currentDate = currentDate.plusDays(1);
        }
        
        // Tổng số lượt chấm công lý tưởng = số nhân viên * số ngày làm việc
        long totalExpectedCheckIns = totalEmployees * workingDays;
        
        // Lấy tất cả attendance trong tháng có checkIn (không phải NOT_CHECKED_IN)
        List<Attendance> attendances = attendanceRepository.findByDateRange(firstDayOfMonth, lastDayOfMonth);
        long totalActualCheckIns = attendances.stream()
                .filter(a -> a.getCheckIn() != null &&
                        a.getStatus() != AttendenceStatus.NOT_CHECKED_IN)
                .count();
        
        // Tính tỷ lệ: (totalActualCheckIns / totalExpectedCheckIns) * 100
        if (totalExpectedCheckIns == 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal rate = new BigDecimal(totalActualCheckIns)
                .divide(new BigDecimal(totalExpectedCheckIns), 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
        
        return rate.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Lấy tất cả thống kê nhân viên và chấm công (8 hàm thống kê)
     * @return EmployeeStatisticsDTO chứa tất cả 8 thống kê
     */
    public EmployeeStatisticsDTO getEmployeeStatistics() {
        EmployeeStatisticsDTO stats = new EmployeeStatisticsDTO();
        
        // 1. Đếm nhân viên có trạng thái hoạt động
        stats.setActiveEmployees(countActiveEmployees());
        
        // 2. Đếm nhân viên mới được add vào trong tháng
        stats.setNewEmployeesThisMonth(countNewEmployeesThisMonth());
        
        // 3. Đếm số đơn nghỉ phép và số đơn chờ duyệt
        Map<String, Long> leaveRequestsMap = countLeaveRequests();
        EmployeeStatisticsDTO.LeaveRequestsStatistics leaveRequests = new EmployeeStatisticsDTO.LeaveRequestsStatistics();
        leaveRequests.setTotalLeaveRequests(leaveRequestsMap.get("totalLeaveRequests"));
        leaveRequests.setPendingLeaveRequests(leaveRequestsMap.get("pendingLeaveRequests"));
        stats.setLeaveRequests(leaveRequests);
        
        // 4. Đếm tổng lương thực nhận của tất cả nhân viên trong tháng
        stats.setTotalNetSalaryThisMonth(getTotalNetSalaryThisMonth());
        
        // 5. Đếm nhân viên check in đúng giờ
        stats.setOnTimeCheckInsThisMonth(countOnTimeCheckInsThisMonth());
        
        // 6. Đếm nhân viên check in trễ
        stats.setLateCheckInsThisMonth(countLateCheckInsThisMonth());
        
        // 7. Đếm nhân viên vắng mặt
        stats.setAbsentEmployeesThisMonth(countAbsentEmployeesThisMonth());
        
        // 8. Tỷ lệ chấm công trung bình
        stats.setAverageAttendanceRateThisMonth(getAverageAttendanceRateThisMonth());
        
        return stats;
    }

    /**
     * Lấy thống kê attendance (đúng giờ, trễ, vắng mặt) của tất cả nhân viên
     * Chia theo từng ngày trong 1 tuần (7 ngày gần nhất)
     * @return WeeklyAttendanceStatisticsDTO chứa thống kê theo từng ngày
     */
    public WeeklyAttendanceStatisticsDTO getWeeklyAttendanceStatistics() {
        LocalDate today = LocalDate.now();
        
        // Lấy 7 ngày gần nhất (bao gồm hôm nay và 6 ngày trước)
        List<WeeklyAttendanceStatisticsDTO.DailyAttendanceStatistics> dailyStats = new ArrayList<>();
        
        // Lấy tất cả nhân viên ACTIVE
        List<Employee> activeEmployees = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
        
        // Lấy tất cả attendance trong 7 ngày gần nhất
        LocalDate startDate = today.minusDays(6); // 7 ngày: từ 6 ngày trước đến hôm nay
        LocalDate endDate = today;
        List<Attendance> attendances = attendanceRepository.findByDateRange(startDate, endDate);
        
        // Lấy tất cả OnLeave APPROVED trong khoảng thời gian này để loại trừ khỏi vắng mặt
        List<OnLeave> approvedLeaves = onLeaveRepository.findAll().stream()
                .filter(leave -> leave.getOnLeaveStatus() == OnLeaveStatus.APPROVED &&
                        leave.getStartDate() != null &&
                        leave.getEndDate() != null &&
                        !leave.getStartDate().isAfter(endDate) &&
                        !leave.getEndDate().isBefore(startDate))
                .collect(Collectors.toList());
        
        // Tạo map: employeeId -> Set<LocalDate> (các ngày có OnLeave APPROVED)
        //  Đảm bảo map đầy đủ & chính xác - chỉ lấy các ngày trong khoảng 7 ngày
        Map<Long, java.util.Set<LocalDate>> employeeApprovedLeaveDates = new HashMap<>();
        for (OnLeave leave : approvedLeaves) {
            if (leave.getEmployee() == null || leave.getEmployee().getId() == null ||
                    leave.getStartDate() == null || leave.getEndDate() == null) {
                continue; // Skip invalid leave records
            }
            
            Long employeeId = leave.getEmployee().getId();
            LocalDate leaveStart = leave.getStartDate();
            LocalDate leaveEnd = leave.getEndDate();
            
            // Chỉ lấy các ngày trong khoảng 7 ngày (startDate đến endDate)
            LocalDate current = leaveStart.isBefore(startDate) ? startDate : leaveStart;
            LocalDate end = leaveEnd.isAfter(endDate) ? endDate : leaveEnd;
            
            employeeApprovedLeaveDates.putIfAbsent(employeeId, new java.util.HashSet<>());
            java.util.Set<LocalDate> dates = employeeApprovedLeaveDates.get(employeeId);
            
            while (!current.isAfter(end)) {
                dates.add(current);
                current = current.plusDays(1);
            }
        }
        
        // Tạo map: date -> List<Attendance> để dễ truy vấn
        Map<LocalDate, List<Attendance>> attendanceByDate = attendances.stream()
                .collect(Collectors.groupingBy(Attendance::getAttendanceDate));
        
        // Tạo map: employeeId -> Set<LocalDate> để biết nhân viên nào đã có attendance
        // ⚠️ FIX 1: Exclude NOT_CHECKED_IN để không làm giảm absentCount sai
        Map<Long, java.util.Set<LocalDate>> employeeAttendanceDates = attendances.stream()
                .filter(a -> a.getEmployee() != null && 
                        a.getEmployee().getId() != null &&
                        a.getStatus() != AttendenceStatus.NOT_CHECKED_IN) // Exclude NOT_CHECKED_IN
                .collect(Collectors.groupingBy(
                        a -> a.getEmployee().getId(),
                        Collectors.mapping(
                                Attendance::getAttendanceDate,
                                Collectors.toSet()
                        )
                ));
        
        // Tính toán cho từng ngày
        for (int i = 0; i < 7; i++) {
            LocalDate date = today.minusDays(6 - i); // Từ ngày xa nhất đến hôm nay
            
            WeeklyAttendanceStatisticsDTO.DailyAttendanceStatistics dailyStat = 
                    new WeeklyAttendanceStatisticsDTO.DailyAttendanceStatistics();
            dailyStat.setDate(date);
            
            // Lấy attendance của ngày này
            List<Attendance> dayAttendances = attendanceByDate.getOrDefault(date, new ArrayList<>());
            
            // Đếm số nhân viên check in đúng giờ (status = IN_WORK)
            long onTimeCount = dayAttendances.stream()
                    .filter(a -> a.getCheckIn() != null &&
                            a.getStatus() == AttendenceStatus.IN_WORK)
                    .map(a -> a.getEmployee() != null ? a.getEmployee().getId() : null)
                    .filter(id -> id != null)
                    .distinct()
                    .count();
            dailyStat.setOnTimeCount(onTimeCount);
            
            // Đếm số nhân viên check in trễ (status = LATE)
            long lateCount = dayAttendances.stream()
                    .filter(a -> a.getCheckIn() != null &&
                            a.getStatus() == AttendenceStatus.LATE)
                    .map(a -> a.getEmployee() != null ? a.getEmployee().getId() : null)
                    .filter(id -> id != null)
                    .distinct()
                    .count();
            dailyStat.setLateCount(lateCount);
            
            // Đếm số nhân viên vắng mặt
            // Logic hợp lý:
            // 1. Chỉ đếm trong ngày làm việc (Monday-Friday)
            // 2. Chỉ đếm nhân viên ACTIVE đã được thuê (hireDate <= date)
            // 3. Loại trừ nhân viên có OnLeave APPROVED trong ngày đó
            // 4. Vắng mặt = không có attendance record HOẶC status = NOT_CHECKED_IN (và không có OnLeave APPROVED)
            long absentCount = 0;
            java.time.DayOfWeek dayOfWeek = date.getDayOfWeek();
            
            // Chỉ đếm vắng mặt trong ngày làm việc (Monday-Friday)
            if (dayOfWeek != java.time.DayOfWeek.SATURDAY && dayOfWeek != java.time.DayOfWeek.SUNDAY) {
                for (Employee employee : activeEmployees) {
                    // Chỉ đếm nhân viên đã được thuê (hireDate <= date)
                    if (employee.getHireDate() != null && employee.getHireDate().isAfter(date)) {
                        continue; // Nhân viên chưa được thuê vào ngày này
                    }
                    
                    Long employeeId = employee.getId();
                    java.util.Set<LocalDate> attendedDates = employeeAttendanceDates.getOrDefault(employeeId, java.util.Collections.emptySet());
                    java.util.Set<LocalDate> approvedLeaveDates = employeeApprovedLeaveDates.getOrDefault(employeeId, java.util.Collections.emptySet());
                    
                    // Nếu có OnLeave APPROVED trong ngày này → không tính là vắng mặt
                    if (approvedLeaveDates.contains(date)) {
                        continue; // Nhân viên có phép, không tính vắng mặt
                    }
                    
                    if (!attendedDates.contains(date)) {
                        // Không có attendance record = vắng mặt
                        absentCount++;
                    } else {
                        // Có attendance record nhưng kiểm tra status
                        //  Filter checkIn != null để tránh lấy record sai
                        Attendance attendance = dayAttendances.stream()
                                .filter(a -> a.getEmployee() != null &&
                                        a.getEmployee().getId().equals(employeeId) &&
                                        a.getCheckIn() != null) // Filter checkIn != null
                                .findFirst()
                                .orElse(null);
                        if (attendance != null && attendance.getStatus() == AttendenceStatus.NOT_CHECKED_IN) {
                            absentCount++;
                        }
                    }
                }
            } else {
                // Cuối tuần: không có nhân viên vắng mặt (vì không phải ngày làm việc)
                absentCount = 0;
            }
            dailyStat.setAbsentCount(absentCount);
            
            dailyStats.add(dailyStat);
        }
        
        WeeklyAttendanceStatisticsDTO result = new WeeklyAttendanceStatisticsDTO();
        result.setDailyStatistics(dailyStats);
        
        return result;
    }

    /**
     * Đếm số lượng nhân viên theo phòng ban
     * @return EmployeeByDepartmentStatisticsDTO chứa danh sách phòng ban và số lượng nhân viên
     */
    public EmployeeByDepartmentStatisticsDTO countEmployeesByDepartment() {
        // Lấy tất cả nhân viên
        List<Employee> allEmployees = employeeRepository.findAll();
        
        // Nhóm theo phòng ban và đếm số lượng
        Map<String, Long> departmentCountMap = allEmployees.stream()
                .filter(e -> e.getDepartment() != null && !e.getDepartment().isEmpty())
                .collect(Collectors.groupingBy(
                        Employee::getDepartment,
                        Collectors.counting()
                ));
        
        // Chuyển đổi sang DTO
        List<EmployeeByDepartmentStatisticsDTO.DepartmentStatistics> departmentStats = departmentCountMap.entrySet().stream()
                .map(entry -> {
                    EmployeeByDepartmentStatisticsDTO.DepartmentStatistics stat = 
                            new EmployeeByDepartmentStatisticsDTO.DepartmentStatistics();
                    stat.setDepartment(entry.getKey());
                    stat.setEmployeeCount(entry.getValue());
                    return stat;
                })
                .sorted((a, b) -> a.getDepartment().compareTo(b.getDepartment())) // Sắp xếp theo tên phòng ban
                .collect(Collectors.toList());
        
        EmployeeByDepartmentStatisticsDTO result = new EmployeeByDepartmentStatisticsDTO();
        result.setDepartments(departmentStats);
        
        return result;
    }
}

