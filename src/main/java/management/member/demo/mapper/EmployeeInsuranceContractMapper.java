package management.member.demo.mapper;

import management.member.demo.dto.AddInsuranceContractForEmployeeRequestDTO;
import management.member.demo.dto.InsuranceContractByEmployeeResponseDTO;
import management.member.demo.dto.UpdateInsuranceContractByEmployeeRequestDTO;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeInsuranceContract;
import management.member.demo.entity.InsuranceContract;
import org.springframework.stereotype.Component;

/**
 * Mapper cho EmployeeInsuranceContract (liên kết nhân viên với contract)
 */
@Component
public class EmployeeInsuranceContractMapper {

    /**
     * Map AddInsuranceContractForEmployeeRequestDTO sang EmployeeInsuranceContract entity
     */
    public EmployeeInsuranceContract toEntity(
            AddInsuranceContractForEmployeeRequestDTO request,
            Employee employee,
            InsuranceContract contract) {
        if (request == null || employee == null || contract == null) {
            return null;
        }
        
        EmployeeInsuranceContract employeeContract = new EmployeeInsuranceContract();
        employeeContract.setEmployee(employee);
        employeeContract.setContract(contract);
        employeeContract.setEffective(request.getEffective());
        employeeContract.setExpiry(request.getExpiry());
        employeeContract.setGrantDate(request.getGrantDate() != null ? request.getGrantDate() : java.time.LocalDate.now());
        return employeeContract;
    }

    /**
     * Map EmployeeInsuranceContract entity sang InsuranceContractByEmployeeResponseDTO
     */
    public InsuranceContractByEmployeeResponseDTO toResponseDTO(
            EmployeeInsuranceContract employeeContract,
            Employee employee,
            String employeeId) {
        if (employeeContract == null) {
            return null;
        }
        
        InsuranceContractByEmployeeResponseDTO dto = new InsuranceContractByEmployeeResponseDTO();
        dto.setEmployeeId(employeeId != null ? employeeId : 
                (employee != null && employee.getEmployeeId() != null ? employee.getEmployeeId() : 
                (employee != null ? String.valueOf(employee.getId()) : "")));
        dto.setFullName(employee != null && employee.getFullName() != null ? employee.getFullName() : "");
        dto.setDepartment(employee != null && employee.getDepartment() != null ? employee.getDepartment() : "");
        
        InsuranceContract contract = employeeContract.getContract();
        if (contract != null) {
            dto.setContractId(contract.getId());
            dto.setInsurenceName(contract.getInsurenceName());
            dto.setEmployerRate(contract.getEmployerRate() != null ? contract.getEmployerRate() : java.math.BigDecimal.ZERO);
            dto.setEmployeeRate(contract.getEmployeeRate() != null ? contract.getEmployeeRate() : java.math.BigDecimal.ZERO);
        } else {
            dto.setEmployerRate(java.math.BigDecimal.ZERO);
            dto.setEmployeeRate(java.math.BigDecimal.ZERO);
        }
        
        dto.setGrantDate(employeeContract.getGrantDate());
        return dto;
    }

    /**
     * Map UpdateInsuranceContractByEmployeeRequestDTO sang EmployeeInsuranceContract entity (update existing)
     */
    public void updateEntityFromRequest(
            EmployeeInsuranceContract employeeContract,
            UpdateInsuranceContractByEmployeeRequestDTO request,
            InsuranceContract contract) {
        if (employeeContract == null || request == null) {
            return;
        }
        
        if (contract != null) {
            employeeContract.setContract(contract);
        }
        employeeContract.setEffective(request.getEffective());
        employeeContract.setExpiry(request.getExpiry());
        if (request.getGrantDate() != null) {
            employeeContract.setGrantDate(request.getGrantDate());
        }
    }
}
