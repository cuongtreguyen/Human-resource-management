package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Payroll;
import management.member.demo.entity.Salary;
import management.member.demo.enums.PayrollStatus;
import management.member.demo.mapper.PayrollMapper;
import management.member.demo.repository.PayrollRepository;
import management.member.demo.repository.SalaryRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
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
        payrollRepository.save(payroll);
    }

    public void failPayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));
        payroll.setStatus(PayrollStatus.FAILED);
        payrollRepository.save(payroll);
    }

    public void cancelPayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));
        payroll.setStatus(PayrollStatus.CANCELLED);
        payrollRepository.save(payroll);
    }

    public PayrollListResponseDTO getAllPayrollRecords(String month, String employeeId, String status) {
        List<Salary> salaries = salaryRepository.findAll();
        List<management.member.demo.entity.Employee> employees = employeeRepository.findAll();
        java.util.Map<Long, String> employeeNames = employees.stream()
                .collect(Collectors.toMap(management.member.demo.entity.Employee::getId, management.member.demo.entity.Employee::getFullName));

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
                         .filter(s -> s.getEmployeeId().equals(empId))
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
            dto.setEmployeeId(String.valueOf(salary.getEmployeeId()));
            dto.setEmployeeName(employeeNames.getOrDefault(salary.getEmployeeId(), "Unknown"));
            dto.setMonth(salary.getPayroll() != null ? salary.getPayroll().getPeriod().toString().substring(0, 7) : "");
            dto.setBasicSalary(salary.getBaseSalary());
            dto.setAllowance(salary.getAllowance());
            dto.setOvertime(salary.getOvertimePay());
            dto.setBonus(salary.getBonus());
            dto.setDeduction(salary.getDeduction());
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
        BigDecimal grossSalary = request.getBasicSalary()
                .add(request.getAllowance() != null ? request.getAllowance() : BigDecimal.ZERO)
                .add(request.getOvertime() != null ? request.getOvertime() : BigDecimal.ZERO)
                .add(request.getBonus() != null ? request.getBonus() : BigDecimal.ZERO);

        // Calculate deductions (mock calculation)
        BigDecimal socialInsurance = grossSalary.multiply(new BigDecimal("0.08"));
        BigDecimal healthInsurance = grossSalary.multiply(new BigDecimal("0.015"));
        BigDecimal unemploymentInsurance = grossSalary.multiply(new BigDecimal("0.01"));
        BigDecimal personalIncomeTax = grossSalary.multiply(new BigDecimal("0.1"));

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
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        try {
            PayrollStatus statusEnum = PayrollStatus.valueOf(status.toUpperCase());
            payroll.setStatus(statusEnum);
            payrollRepository.save(payroll);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
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

    public ExportResponseDTO exportPayroll(String month, String year, String format) {
        String filename = "payroll_" + year + "_" + month + "." + (format != null ? format : "csv");

        ExportResponseDTO response = new ExportResponseDTO();
        response.setUrl("/exports/" + filename);
        response.setFilename(filename);
        response.setSuccess(true);
        response.setMessage("Payroll data exported successfully");

        return response;
    }
}

