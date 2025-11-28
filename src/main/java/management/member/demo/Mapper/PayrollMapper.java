package management.member.demo.Mapper;

import management.member.demo.Enum.PayrollStatus;
import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.Payroll;
import management.member.demo.entity.Salary;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO
 */
@Component
public class PayrollMapper {

    /**
     * Map Payroll entity sang PayrollResponse DTO
     */
    public PayrollResponse toResponse(Payroll payroll) {
        return PayrollResponse.builder()
                .id(payroll.getId())
                .code(payroll.getCode())
                .period(payroll.getPeriod())
                .createdDate(payroll.getCreatedDate())
                .totalAmount(payroll.getTotalAmount())
                .status(payroll.getStatus())
                .note(payroll.getNote())
                // employees (PayrollEmployeeSummary) không map ở đây, để Service set nếu cần
                .build();
    }

    /**
     * Map PayrollRequest DTO sang Payroll entity (chỉ mapping, không validate)
     */
    public void updatePayrollFromRequest(Payroll payroll, PayrollRequest request) {
        payroll.setCode(request.getCode());
        payroll.setPeriod(request.getPeriod());
        payroll.setCreatedDate(request.getCreatedDate());
        payroll.setTotalAmount(request.getTotalAmount());
        payroll.setStatus(request.getStatus());
        payroll.setNote(request.getNote());
    }

    /**
     * Tạo Payroll entity mới từ PayrollRequest DTO
     */
    public Payroll toEntity(PayrollRequest request) {
        Payroll payroll = new Payroll();
        updatePayrollFromRequest(payroll, request);
        return payroll;
    }

    /**
     * Map Salary entity sang PayrollListItemDTO
     */
    public PayrollListItemDTO toPayrollListItemDTO(Salary salary, Employee employee) {
        PayrollListItemDTO dto = new PayrollListItemDTO();
        dto.setId(String.valueOf(salary.getId()));
        dto.setEmployeeId(String.valueOf(salary.getEmployeeId()));
        
        if (employee != null) {
            dto.setEmployeeName(employee.getFullName());
        }
        
        // Format month from paymentDate
        if (salary.getPaymentDate() != null) {
            dto.setMonth(salary.getPaymentDate().format(DateTimeFormatter.ofPattern("yyyy-MM")));
        }
        
        dto.setBasicSalary(salary.getBaseSalary());
        dto.setAllowance(salary.getAllowance() != null ? salary.getAllowance() : BigDecimal.ZERO);
        dto.setOvertime(salary.getOvertimePay() != null ? salary.getOvertimePay() : BigDecimal.ZERO);
        dto.setBonus(salary.getBonus() != null ? salary.getBonus() : BigDecimal.ZERO);
        dto.setDeduction(salary.getDeduction() != null ? salary.getDeduction() : BigDecimal.ZERO);
        dto.setNetSalary(salary.getNetSalary());
        
        // Map status
        if (salary.getPayroll() != null) {
            PayrollStatus payrollStatus = salary.getPayroll().getStatus();
            dto.setStatus(payrollStatus == PayrollStatus.PAID ? "paid" : "pending");
        } else {
            dto.setStatus("pending");
        }
        
        return dto;
    }

    /**
     * Map Salary và Employee sang CalculatePayrollResponseDTO
     */
    public CalculatePayrollResponseDTO toCalculatePayrollResponseDTO(Salary salary, Employee employee, 
                                                                     CalculatePayrollRequestDTO request, 
                                                                     BigDecimal netSalary) {
        CalculatePayrollResponseDTO dto = new CalculatePayrollResponseDTO();
        dto.setId(String.valueOf(salary.getId()));
        dto.setEmployeeId(request.getEmployeeId());
        dto.setEmployeeName(employee != null ? employee.getFullName() : null);
        dto.setMonth(request.getMonth());
        dto.setBasicSalary(request.getBasicSalary());
        dto.setAllowance(request.getAllowance() != null ? request.getAllowance() : BigDecimal.ZERO);
        dto.setOvertime(request.getOvertime() != null ? request.getOvertime() : BigDecimal.ZERO);
        dto.setBonus(request.getBonus() != null ? request.getBonus() : BigDecimal.ZERO);
        dto.setDeduction(request.getDeduction() != null ? request.getDeduction() : BigDecimal.ZERO);
        dto.setNetSalary(netSalary);
        dto.setStatus("pending");
        dto.setMessage("Payroll calculated successfully");
        dto.setSuccess(true);
        return dto;
    }
}

