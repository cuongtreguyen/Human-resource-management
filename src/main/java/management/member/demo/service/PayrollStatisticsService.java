package management.member.demo.service;

import management.member.demo.dto.DashboardPayrollStatisticsDTO;
import management.member.demo.dto.MonthlyPayrollDTO;
import management.member.demo.dto.PayrollByDepartmentDTO;
import management.member.demo.dto.PayrollStatisticsDTO;
import management.member.demo.dto.WaitingPayrollListDTO;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.entity.Payroll;
import management.member.demo.entity.Salary;
import management.member.demo.enums.BenefitsStatus;
import management.member.demo.enums.EmployeeStatus;
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

    /**
     * Tổng lương thực lĩnh của tất cả nhân viên có trạng thái payroll là PAID (tháng hiện tại)
     */
    public BigDecimal getTotalPayroll() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // Lấy tất cả payroll có status PAID và paymentDate trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này và tính tổng netSalary
        return paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .map(salary -> salary.getNetSalary() != null ? salary.getNetSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Đếm những payroll có trạng thái PENDING (tháng hiện tại)
     */
    public Long getPendingPayroll() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        return payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PENDING
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                .count();
    }

    /**
     * Tổng của các tổng chi của các phúc lợi có trạng thái active (tháng hiện tại)
     * Chỉ tính cho nhân viên có payroll PAID trong tháng hiện tại
     */
    public BigDecimal getAllowanceTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // Lấy tất cả payroll có status PAID và paymentDate trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả employeeId từ các payroll này
        List<Long> employeeIds = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .map(Salary::getEmployeeId)
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
     */
    public BigDecimal getBasicSalaryTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // Lấy tất cả payroll có status PAID và paymentDate trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE và tính tổng baseSalary
        return salaries.stream()
                .filter(salary -> {
                    Employee employee = employeeRepository.findById(salary.getEmployeeId()).orElse(null);
                    return employee != null && employee.getStatus() == EmployeeStatus.ACTIVE;
                })
                .map(salary -> salary.getBaseSalary() != null ? salary.getBaseSalary() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Lương cơ bản của từng nhân viên + phụ cấp cố định * 21.5% trần là 36tr trên từng nhân viên rồi tổng tất cả lại (tháng hiện tại)
     * Chỉ tính cho nhân viên có payroll PAID trong tháng hiện tại
     */
    public BigDecimal getInsuranceTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // Lấy tất cả payroll có status PAID và paymentDate trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE
        List<Salary> activeSalaries = salaries.stream()
                .filter(salary -> {
                    Employee employee = employeeRepository.findById(salary.getEmployeeId()).orElse(null);
                    return employee != null && employee.getStatus() == EmployeeStatus.ACTIVE;
                })
                .collect(Collectors.toList());
        
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal maxInsuranceBase = new BigDecimal("36000000"); // 36 triệu
        BigDecimal insuranceRate = new BigDecimal("0.215"); // 21.5%
        
        for (Salary salary : activeSalaries) {
            // Lấy baseSalary từ salary
            BigDecimal baseSalary = salary.getBaseSalary() != null ? salary.getBaseSalary() : BigDecimal.ZERO;
            
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
     */
    public BigDecimal getOvertimeTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // Lấy tất cả payroll có status PAID và paymentDate trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE và tính tổng otPay
        return salaries.stream()
                .filter(salary -> {
                    Employee employee = employeeRepository.findById(salary.getEmployeeId()).orElse(null);
                    return employee != null && employee.getStatus() == EmployeeStatus.ACTIVE;
                })
                .map(salary -> salary.getOtPay() != null ? salary.getOtPay() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Tổng thuế thu nhập cá nhân (personalIncomeTax) của tất cả nhân viên có trạng thái hoạt động và payroll có trạng thái PAID (tháng hiện tại)
     */
    public BigDecimal getTotalTax() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // Lấy tất cả payroll có status PAID và paymentDate trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE và tính tổng personalIncomeTax
        return salaries.stream()
                .filter(salary -> {
                    Employee employee = employeeRepository.findById(salary.getEmployeeId()).orElse(null);
                    return employee != null && employee.getStatus() == EmployeeStatus.ACTIVE;
                })
                .map(salary -> salary.getPersonalIncomeTax() != null ? salary.getPersonalIncomeTax() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Tổng bonus của tất cả nhân viên có trạng thái hoạt động và payroll có trạng thái PAID (tháng hiện tại)
     */
    public BigDecimal getBonusTotal() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // Lấy tất cả payroll có status PAID và paymentDate trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên có status ACTIVE và tính tổng bonus
        return salaries.stream()
                .filter(salary -> {
                    Employee employee = employeeRepository.findById(salary.getEmployeeId()).orElse(null);
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
                    Employee employee = employeeRepository.findById(salary.getEmployeeId()).orElse(null);
                    
                    WaitingPayrollListDTO dto = new WaitingPayrollListDTO();
                    // Set employeeId (ưu tiên employeeId từ Employee, nếu không có thì dùng id)
                    if (employee != null && employee.getEmployeeId() != null) {
                        dto.setEmployeeId(employee.getEmployeeId());
                    } else if (employee != null) {
                        dto.setEmployeeId(String.valueOf(employee.getId()));
                    } else {
                        dto.setEmployeeId(String.valueOf(salary.getEmployeeId()));
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
     */
    public BigDecimal getTotalPayrollEmployeeByDepartment(String department) {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        
        // Lấy tất cả payroll có status PAID và paymentDate trong tháng hiện tại
        List<Payroll> paidPayrolls = payrollRepository.findAll().stream()
                .filter(p -> p.getStatus() == PayrollStatus.PAID 
                        && p.getPaymentDate() != null
                        && YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                .collect(Collectors.toList());
        
        // Lấy tất cả salary từ các payroll này
        List<Salary> salaries = paidPayrolls.stream()
                .flatMap(payroll -> salaryRepository.findByPayrollId(payroll.getId()).stream())
                .collect(Collectors.toList());
        
        // Lọc các salary của nhân viên thuộc department và tính tổng netSalary
        return salaries.stream()
                .filter(salary -> {
                    Employee employee = employeeRepository.findById(salary.getEmployeeId()).orElse(null);
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
}

