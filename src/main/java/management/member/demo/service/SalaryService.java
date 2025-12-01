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
import java.util.Optional;

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
        Optional<Salary> latestSalary = salaryRepository.findFirstByEmployeeIdOrderByPaymentDateDesc(employeeId);
        return latestSalary.map(Salary::getNetSalary)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));
    }

    public BigDecimal calculateAverageSalary(Long employeeId) {
        List<Salary> salaries = salaryRepository.findByEmployeeIdOrderByPaymentDateDesc(employeeId);
        if (salaries.isEmpty()) {
            throw new ResourceNotFoundException(
                    ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId);
        }

        BigDecimal sum = salaries.stream()
                .map(Salary::getNetSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return sum.divide(BigDecimal.valueOf(salaries.size()), 2, RoundingMode.HALF_UP);
    }

    public SalarySummaryResponse getSalarySummary(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeId));

        List<Salary> salaries = salaryRepository.findByEmployeeIdOrderByPaymentDateDesc(employeeId);

        SalarySummaryResponse response = new SalarySummaryResponse();
        response.setLatestSalary(calculateLatestSalary(employeeId));
        response.setAverageSalary(calculateAverageSalary(employeeId));
        response.setTotalIncome(salaries.stream()
                .map(Salary::getNetSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        return response;
    }

    public SalaryResponse createSalary(SalaryRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + request.getEmployeeId()));

        Salary salary = new Salary();
        salary.setEmployeeId(request.getEmployeeId());
        salary.setBaseSalary(request.getBaseSalary());
        salary.setAllowance(request.getAllowance());
        salary.setOvertimePay(request.getOvertimePay());
        salary.setBonus(request.getBonus());
        salary.setDeduction(request.getDeduction());

        BigDecimal netSalary = request.getBaseSalary()
                .add(request.getAllowance() != null ? request.getAllowance() : BigDecimal.ZERO)
                .add(request.getOvertimePay() != null ? request.getOvertimePay() : BigDecimal.ZERO)
                .add(request.getBonus() != null ? request.getBonus() : BigDecimal.ZERO)
                .subtract(request.getDeduction() != null ? request.getDeduction() : BigDecimal.ZERO);

        salary.setNetSalary(netSalary);
        salary.setPaymentDate(request.getPaymentDate());
        salary.setStatus(management.member.demo.enums.SalaryStatus.AWAITING);

        Salary saved = salaryRepository.save(salary);
        return salaryMapper.toResponse(saved);
    }
    
    public BigDecimal calculateTotalIncome(Long employeeId) {
        List<Salary> salaries = salaryRepository.findByEmployeeIdOrderByPaymentDateDesc(employeeId);
        return salaries.stream()
                .map(Salary::getNetSalary)
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
        
        if (request.getBaseSalary() != null) {
            salary.setBaseSalary(request.getBaseSalary());
        }
        if (request.getAllowance() != null) {
            salary.setAllowance(request.getAllowance());
        }
        if (request.getOvertimePay() != null) {
            salary.setOvertimePay(request.getOvertimePay());
        }
        if (request.getBonus() != null) {
            salary.setBonus(request.getBonus());
        }
        if (request.getDeduction() != null) {
            salary.setDeduction(request.getDeduction());
        }
        
        // Recalculate net salary
        BigDecimal netSalary = salary.getBaseSalary()
                .add(salary.getAllowance() != null ? salary.getAllowance() : BigDecimal.ZERO)
                .add(salary.getOvertimePay() != null ? salary.getOvertimePay() : BigDecimal.ZERO)
                .add(salary.getBonus() != null ? salary.getBonus() : BigDecimal.ZERO)
                .subtract(salary.getDeduction() != null ? salary.getDeduction() : BigDecimal.ZERO);
        salary.setNetSalary(netSalary);
        
        if (request.getPaymentDate() != null) {
            salary.setPaymentDate(request.getPaymentDate());
        }
        
        Salary updated = salaryRepository.save(salary);
        return salaryMapper.toResponse(updated);
    }
}

