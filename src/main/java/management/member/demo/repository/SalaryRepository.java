package management.member.demo.repository;

import management.member.demo.enums.SalaryStatus;
import management.member.demo.entity.Employee;
import management.member.demo.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    
    /**
     * Tìm salary gần nhất của employee theo paymentDate của Payroll (tháng gần nhất)
     * Sắp xếp theo paymentDate DESC, sau đó theo id DESC để đảm bảo unique khi có cùng paymentDate
     * Trả về List để tránh lỗi NonUniqueResultException khi có nhiều records cùng paymentDate
     * Service layer sẽ lấy phần tử đầu tiên từ list
     */
    @Query("SELECT s FROM Salary s WHERE s.employee.id = :employeeId ORDER BY s.payroll.paymentDate DESC NULLS LAST, s.id DESC")
    List<Salary> findFirstByEmployeeIdOrderByPayrollPaymentDateDesc(@Param("employeeId") Long employeeId);
    
    /**
     * Lấy tất cả salary records của employee, sắp xếp theo paymentDate của Payroll
     */
    @Query("SELECT s FROM Salary s WHERE s.employee.id = :employeeId ORDER BY s.payroll.paymentDate DESC")
    List<Salary> findByEmployeeIdOrderByPayrollPaymentDateDesc(@Param("employeeId") Long employeeId);
    
    /**
     * Lấy tất cả salary records hợp lệ của employee (status = SUCCESS)
     * Sắp xếp theo paymentDate của Payroll
     */
    @Query("SELECT s FROM Salary s WHERE s.employee.id = :employeeId AND s.status = :status ORDER BY s.payroll.paymentDate DESC")
    List<Salary> findByEmployeeIdAndStatusOrderByPayrollPaymentDateDesc(@Param("employeeId") Long employeeId, @Param("status") SalaryStatus status);
    
    /**
     * Kiểm tra employee có salary record không
     */
    @Query("SELECT COUNT(s) > 0 FROM Salary s WHERE s.employee.id = :employeeId")
    boolean existsByEmployeeId(@Param("employeeId") Long employeeId);
    
    /**
     * Tìm tất cả salary records theo Employee entity (Long id)
     */
    @Query("SELECT s FROM Salary s WHERE s.employee.id = :employeeId")
    List<Salary> findByEmployeeId(@Param("employeeId") Long employeeId);
    
    /**
     * Lấy tất cả salary records theo Employee entity
     */
    List<Salary> findByEmployee(Employee employee);
    
    /**
     * Lấy tất cả salary records theo payroll ID
     */
    List<Salary> findByPayrollId(Long payrollId);
}
