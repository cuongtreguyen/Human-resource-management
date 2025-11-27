package management.member.demo.repository;

import management.member.demo.Enum.EmployeeStatus;
import management.member.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findById(Long id);
    
    // Tìm theo phòng ban
    List<Employee> findByDepartment(String department);
    
    // Tìm theo chức vụ
    List<Employee> findByPosition(String position);
    
    // Tìm theo phòng ban và chức vụ
    List<Employee> findByDepartmentAndPosition(String department, String position);
    
    // Tìm theo khoảng lương
    List<Employee> findByBaseSalaryBetween(BigDecimal minSalary, BigDecimal maxSalary);
    
    // Tìm theo phòng ban và khoảng lương
    List<Employee> findByDepartmentAndBaseSalaryBetween(String department, BigDecimal minSalary, BigDecimal maxSalary);
    
    // Tìm theo chức vụ và khoảng lương
    List<Employee> findByPositionAndBaseSalaryBetween(String position, BigDecimal minSalary, BigDecimal maxSalary);
    
    // Tìm theo phòng ban, chức vụ và khoảng lương
    List<Employee> findByDepartmentAndPositionAndBaseSalaryBetween(String department, String position, BigDecimal minSalary, BigDecimal maxSalary);
    
    // Đếm số lượng nhân viên theo status
    long countByStatus(EmployeeStatus status);
    
    // Kiểm tra email đã tồn tại chưa
    boolean existsByEmail(String email);
}

