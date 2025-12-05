package management.member.demo.mapper;

import management.member.demo.dto.AddBenefitForEmployeeRequestDTO;
import management.member.demo.dto.EmployeeBenefitResponseDTO;
import management.member.demo.dto.UpdateEmployeeBenefitRequestDTO;
import management.member.demo.entity.Benefits;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeBenefits;
import org.springframework.stereotype.Component;

/**
 * Mapper cho EmployeeBenefits (liên kết nhân viên với benefit)
 */
@Component
public class EmployeeBenefitsMapper {

    /**
     * Map AddBenefitForEmployeeRequestDTO sang EmployeeBenefits entity
     */
    public EmployeeBenefits toEntity(
            AddBenefitForEmployeeRequestDTO request,
            Employee employee,
            Benefits benefit) {
        if (request == null || employee == null || benefit == null) {
            return null;
        }
        
        EmployeeBenefits employeeBenefit = new EmployeeBenefits();
        employeeBenefit.setEmployee(employee);
        employeeBenefit.setBenefit(benefit);
        employeeBenefit.setGrantDate(request.getGrantDate() != null ? request.getGrantDate() : java.time.LocalDate.now());
        employeeBenefit.setStatus(request.getStatus());
        return employeeBenefit;
    }

    /**
     * Map EmployeeBenefits entity sang EmployeeBenefitResponseDTO
     */
    public EmployeeBenefitResponseDTO toResponseDTO(
            EmployeeBenefits employeeBenefit,
            Employee employee,
            String employeeId) {
        if (employeeBenefit == null) {
            return null;
        }
        
        EmployeeBenefitResponseDTO dto = new EmployeeBenefitResponseDTO();
        dto.setEmployeeId(employeeId != null ? employeeId : 
                (employee != null && employee.getEmployeeId() != null ? employee.getEmployeeId() : 
                (employee != null ? String.valueOf(employee.getId()) : "")));
        dto.setFullName(employee != null && employee.getFullName() != null ? employee.getFullName() : "");
        dto.setDepartment(employee != null && employee.getDepartment() != null ? employee.getDepartment() : "");
        
        Benefits benefit = employeeBenefit.getBenefit();
        if (benefit != null) {
            dto.setBenefitId(benefit.getBenefitId());
            dto.setBenefitName(benefit.getBenefitName());
            dto.setAllowanceAmount(benefit.getAllowanceAmount() != null ? benefit.getAllowanceAmount() : java.math.BigDecimal.ZERO);
        } else {
            dto.setAllowanceAmount(java.math.BigDecimal.ZERO);
        }
        
        dto.setGrantDate(employeeBenefit.getGrantDate());
        dto.setStatus(employeeBenefit.getStatus());
        return dto;
    }

    /**
     * Map UpdateEmployeeBenefitRequestDTO sang EmployeeBenefits entity (update existing)
     */
    public void updateEntityFromRequest(
            EmployeeBenefits employeeBenefit,
            UpdateEmployeeBenefitRequestDTO request,
            Benefits benefit) {
        if (employeeBenefit == null || request == null) {
            return;
        }
        
        if (benefit != null) {
            employeeBenefit.setBenefit(benefit);
        }
        if (request.getGrantDate() != null) {
            employeeBenefit.setGrantDate(request.getGrantDate());
        }
        if (request.getStatus() != null) {
            employeeBenefit.setStatus(request.getStatus());
        }
    }
}
