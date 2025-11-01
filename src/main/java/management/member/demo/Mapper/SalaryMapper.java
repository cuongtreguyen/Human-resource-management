package management.member.demo.Mapper;

import management.member.demo.dto.SalaryRequest;
import management.member.demo.dto.SalaryResponse;
import management.member.demo.entity.Salary;
import org.springframework.stereotype.Component;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO
 */
@Component
public class SalaryMapper {

    /**
     * Map Salary entity sang SalaryResponse DTO
     */
    public SalaryResponse toResponse(Salary salary) {
        return SalaryResponse.builder()
                .id(salary.getId())
                .employeeId(salary.getEmployeeId())
                .baseSalary(salary.getBaseSalary())
                .allowance(salary.getAllowance())
                .overtimePay(salary.getOvertimePay())
                .bonus(salary.getBonus())
                .deduction(salary.getDeduction())
                .netSalary(salary.getNetSalary())
                .status(salary.getStatus())
                .paymentDate(salary.getPaymentDate())
                .build();
    }

    /**
     * Map SalaryRequest DTO sang Salary entity (chỉ mapping, không validate)
     */
    public void updateSalaryFromRequest(Salary salary, SalaryRequest request) {
        salary.setEmployeeId(request.getEmployeeId());
        salary.setBaseSalary(request.getBaseSalary());
        salary.setAllowance(request.getAllowance());
        salary.setOvertimePay(request.getOvertimePay());
        salary.setBonus(request.getBonus());
        salary.setDeduction(request.getDeduction());
        salary.setStatus(request.getStatus());
        salary.setPaymentDate(request.getPaymentDate());
        // netSalary được tính tự động trong Service, không map từ request
    }

    /**
     * Tạo Salary entity mới từ SalaryRequest DTO
     */
    public Salary toEntity(SalaryRequest request) {
        Salary salary = new Salary();
        updateSalaryFromRequest(salary, request);
        return salary;
    }
}

