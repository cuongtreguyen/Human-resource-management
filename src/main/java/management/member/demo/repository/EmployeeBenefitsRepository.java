package management.member.demo.repository;

import management.member.demo.entity.Benefits;
import management.member.demo.entity.Employee;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.enums.BenefitsStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeBenefitsRepository extends JpaRepository<EmployeeBenefits, Long> {
    /**
     * Tìm tất cả EmployeeBenefits theo Employee entity
     */
    List<EmployeeBenefits> findByEmployee(Employee employee);
    
    /**
     * Tìm tất cả EmployeeBenefits theo employeeId (String) - query theo employee.employeeId
     */
    @Query("SELECT eb FROM EmployeeBenefits eb WHERE eb.employee.employeeId = :employeeId")
    List<EmployeeBenefits> findByEmployeeId(@Param("employeeId") String employeeId);
    
    /**
     * Tìm tất cả EmployeeBenefits theo employeeId (Long) - query theo employee.id
     */
    @Query("SELECT eb FROM EmployeeBenefits eb WHERE eb.employee.id = :employeeId")
    List<EmployeeBenefits> findByEmployeeId(@Param("employeeId") Long employeeId);
    
    /**
     * Tìm tất cả EmployeeBenefits theo Benefits
     */
    List<EmployeeBenefits> findByBenefit(Benefits benefit);
    
    /**
     * Tìm EmployeeBenefits theo employee và benefit
     */
    List<EmployeeBenefits> findByEmployeeAndBenefit(Employee employee, Benefits benefit);
    
    /**
     * Tìm EmployeeBenefits theo employeeId (String) và benefitId
     */
    @Query("SELECT eb FROM EmployeeBenefits eb WHERE eb.employee.employeeId = :employeeId AND eb.benefit.benefitId = :benefitId")
    List<EmployeeBenefits> findByEmployeeIdAndBenefitId(@Param("employeeId") String employeeId, @Param("benefitId") String benefitId);
}
