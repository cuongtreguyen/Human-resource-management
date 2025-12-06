package management.member.demo.mapper;

import management.member.demo.enums.PayrollStatus;
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
                .paymentDate(payroll.getPaymentDate())
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
        payroll.setPaymentDate(request.getPaymentDate());
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
        dto.setEmployeeId(String.valueOf(salary.getEmployee() != null ? salary.getEmployee().getId() : null));
        
        if (employee != null) {
            dto.setEmployeeName(employee.getFullName());
        }
        
        // Format month from paymentDate của Payroll
        if (salary.getPayroll() != null && salary.getPayroll().getPaymentDate() != null) {
            dto.setMonth(salary.getPayroll().getPaymentDate().format(DateTimeFormatter.ofPattern("yyyy-MM")));
        }
        
        dto.setBasicSalary(salary.getBaseSalary());
        dto.setAllowance(salary.getAllowance() != null ? salary.getAllowance() : BigDecimal.ZERO);
        dto.setOvertime(salary.getOtPay() != null ? salary.getOtPay() : BigDecimal.ZERO);
        dto.setBonus(salary.getBonus() != null ? salary.getBonus() : BigDecimal.ZERO);
        dto.setDeduction(salary.getGeneralDeductions() != null ? salary.getGeneralDeductions() : BigDecimal.ZERO);
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
        CalculatePayrollResponseDTO.PayrollData data = new CalculatePayrollResponseDTO.PayrollData();
        data.setId(String.valueOf(salary.getId()));
        data.setEmployeeId(request.getEmployeeId());
        data.setEmployeeName(employee != null ? employee.getFullName() : null);
        data.setMonth(request.getMonth());
        data.setBasicSalary(request.getBasicSalary());
        data.setAllowance(request.getAllowance() != null ? request.getAllowance() : BigDecimal.ZERO);
        data.setOvertime(request.getOvertime() != null ? request.getOvertime() : BigDecimal.ZERO);
        data.setBonus(request.getBonus() != null ? request.getBonus() : BigDecimal.ZERO);
        data.setDeduction(request.getDeduction() != null ? request.getDeduction() : BigDecimal.ZERO);
        data.setNetSalary(netSalary);
        data.setStatus("pending");
        dto.setData(data);
        dto.setMessage("Payroll calculated successfully");
        dto.setSuccess(true);
        return dto;
    }
}

