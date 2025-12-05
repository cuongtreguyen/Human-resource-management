package management.member.demo.repository;

import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeInsuranceContract;
import management.member.demo.entity.InsuranceContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeInsuranceContractRepository extends JpaRepository<EmployeeInsuranceContract, Long> {
    /**
     * Tìm tất cả EmployeeInsuranceContract theo Employee entity
     */
    List<EmployeeInsuranceContract> findByEmployee(Employee employee);
    
    /**
     * Tìm tất cả EmployeeInsuranceContract theo employeeId (String) - query theo employee.employeeId
     */
    @Query("SELECT eic FROM EmployeeInsuranceContract eic WHERE eic.employee.employeeId = :employeeId")
    List<EmployeeInsuranceContract> findByEmployeeId(@Param("employeeId") String employeeId);
    
    /**
     * Tìm tất cả EmployeeInsuranceContract theo employeeId (Long) - query theo employee.id
     */
    @Query("SELECT eic FROM EmployeeInsuranceContract eic WHERE eic.employee.id = :employeeId")
    List<EmployeeInsuranceContract> findByEmployeeId(@Param("employeeId") Long employeeId);
    
    /**
     * Tìm tất cả EmployeeInsuranceContract theo InsuranceContract
     */
    List<EmployeeInsuranceContract> findByContract(InsuranceContract contract);
    
    /**
     * Tìm EmployeeInsuranceContract theo employee và contract
     */
    List<EmployeeInsuranceContract> findByEmployeeAndContract(Employee employee, InsuranceContract contract);
}
