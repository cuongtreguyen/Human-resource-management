package management.member.demo.repository;

import management.member.demo.Enum.SalaryStatus;
import management.member.demo.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    
    /**
     * Tìm salary gần nhất của employee theo paymentDate (tháng gần nhất)
     * Sử dụng Spring Data JPA method naming convention
     */
    Optional<Salary> findFirstByEmployeeIdOrderByPaymentDateDesc(Long employeeId);
    
    /**
     * Lấy tất cả salary records của employee, sắp xếp theo paymentDate
     */
    List<Salary> findByEmployeeIdOrderByPaymentDateDesc(Long employeeId);
    
    /**
     * Lấy tất cả salary records hợp lệ của employee (status = SUCCESS)
     * Sắp xếp theo paymentDate
     */
    List<Salary> findByEmployeeIdAndStatusOrderByPaymentDateDesc(Long employeeId, SalaryStatus status);
    
    /**
     * Kiểm tra employee có salary record không
     */
    boolean existsByEmployeeId(Long employeeId);
    
    /**
     * Lấy tất cả salary records theo payroll ID
     */
    List<Salary> findByPayrollId(Long payrollId);
}
