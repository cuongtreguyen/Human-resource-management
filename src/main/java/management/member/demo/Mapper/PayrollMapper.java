package management.member.demo.Mapper;

import management.member.demo.dto.PayrollRequest;
import management.member.demo.dto.PayrollResponse;
import management.member.demo.entity.Payroll;
import org.springframework.stereotype.Component;

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
}

