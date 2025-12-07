package management.member.demo.mapper;

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
        SalaryResponse response = SalaryResponse.builder()
                .id(salary.getId())
                // Lấy String employeeId (EMP***) của Employee, nếu không có thì dùng Long id
                .employeeId(salary.getEmployee() != null && salary.getEmployee().getEmployeeId() != null 
                        ? salary.getEmployee().getEmployeeId() 
                        : (salary.getEmployee() != null ? String.valueOf(salary.getEmployee().getId()) : null))
                .baseSalary(salary.getEmployee() != null && salary.getEmployee().getBaseSalary() != null 
                        ? salary.getEmployee().getBaseSalary() 
                        : null)
                .allowance(salary.getAllowance())
                .allowances(salary.getAllowance()) // Alias
                .overtimePay(salary.getOtPay()) // Map từ otPay
                .otPay(salary.getOtPay())
                .bonus(salary.getBonus())
                .bonuses(salary.getBonus()) // Alias
                .deduction(salary.getGeneralDeductions()) // Map từ generalDeductions
                .deductions(salary.getGeneralDeductions()) // Alias
                .otHours(null) // otHours không còn trong Salary, sẽ tính từ OverTime
                .grossIncome(salary.getGrossIncome())
                .socialInsurance(salary.getSocialInsurance())
                .healthInsurance(salary.getHealthInsurance())
                .unemploymentInsurance(salary.getUnemploymentInsurance())
                .totalInsurance(salary.getTotalInsurance())
                .generalDeductions(salary.getGeneralDeductions())
                .personalIncomeTax(salary.getPersonalIncomeTax())
                .totalDeductions(salary.getTotalDeductions())
                .netSalary(salary.getNetSalary())
                .status(salary.getStatus())
                .build();
        return response;
    }

    /**
     * Map SalaryRequest DTO sang Salary entity (chỉ mapping, không validate)
     * Lưu ý: employeeId trong request sẽ được dùng để tìm Employee entity trong Service layer
     */
    public void updateSalaryFromRequest(Salary salary, SalaryRequest request) {
        // employeeId sẽ được set trong Service layer bằng cách set Employee entity
        // baseSalary không được set vào Salary, sẽ lấy từ Employee trong Service layer
        // Map allowance (ưu tiên allowances nếu có, nếu không thì dùng allowance)
        salary.setAllowance(request.getAllowances() != null ? request.getAllowances() : request.getAllowance());
        // Map otPay (ưu tiên otPay nếu có, nếu không thì dùng overtimePay)
        salary.setOtPay(request.getOtPay() != null ? request.getOtPay() : request.getOvertimePay());
        // otHours không còn trong Salary entity, sẽ tính từ OverTime
        // Map bonus (ưu tiên bonuses nếu có, nếu không thì dùng bonus)
        salary.setBonus(request.getBonuses() != null ? request.getBonuses() : request.getBonus());
        // Map generalDeductions (ưu tiên deductions nếu có, nếu không thì dùng deduction)
        salary.setGeneralDeductions(request.getDeductions() != null ? request.getDeductions() : 
                (request.getGeneralDeductions() != null ? request.getGeneralDeductions() : 
                (request.getDeduction() != null ? request.getDeduction() : null)));
        salary.setGrossIncome(request.getGrossIncome());
        salary.setSocialInsurance(request.getSocialInsurance());
        salary.setHealthInsurance(request.getHealthInsurance());
        salary.setUnemploymentInsurance(request.getUnemploymentInsurance());
        salary.setTotalInsurance(request.getTotalInsurance());
        salary.setPersonalIncomeTax(request.getPersonalIncomeTax());
        salary.setTotalDeductions(request.getTotalDeductions());
        salary.setStatus(request.getStatus());
        // paymentDate không còn trong Salary, được quản lý bởi Payroll
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

