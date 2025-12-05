package management.member.demo.repository;

import management.member.demo.enums.SalaryStatus;
import management.member.demo.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    
    /**
     * Tìm salary gần nhất của employee theo paymentDate của Payroll (tháng gần nhất)
     */
    @Query("SELECT s FROM Salary s WHERE s.employeeId = :employeeId ORDER BY s.payroll.paymentDate DESC")
    Optional<Salary> findFirstByEmployeeIdOrderByPayrollPaymentDateDesc(@Param("employeeId") Long employeeId);
    
    /**
     * Lấy tất cả salary records của employee, sắp xếp theo paymentDate của Payroll
     */
    @Query("SELECT s FROM Salary s WHERE s.employeeId = :employeeId ORDER BY s.payroll.paymentDate DESC")
    List<Salary> findByEmployeeIdOrderByPayrollPaymentDateDesc(@Param("employeeId") Long employeeId);
    
    /**
     * Lấy tất cả salary records hợp lệ của employee (status = SUCCESS)
     * Sắp xếp theo paymentDate của Payroll
     */
    @Query("SELECT s FROM Salary s WHERE s.employeeId = :employeeId AND s.status = :status ORDER BY s.payroll.paymentDate DESC")
    List<Salary> findByEmployeeIdAndStatusOrderByPayrollPaymentDateDesc(@Param("employeeId") Long employeeId, @Param("status") SalaryStatus status);
    
    /**
     * Kiểm tra employee có salary record không
     */
    boolean existsByEmployeeId(Long employeeId);
    
    /**
     * Lấy tất cả salary records theo payroll ID
     */
    List<Salary> findByPayrollId(Long payrollId);
}
