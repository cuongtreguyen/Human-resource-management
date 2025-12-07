package management.member.demo.repository;

import management.member.demo.dto.EmployeeEvaluationSummaryDTO;
import management.member.demo.enums.EmployeeStatus;
import management.member.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    // Tìm theo status
    List<Employee> findByStatus(EmployeeStatus status);
    
    // Tìm theo phòng ban và chức vụ
    List<Employee> findByDepartmentAndPosition(String department, String position);
    
    // Tìm theo phòng ban và status
    List<Employee> findByDepartmentAndStatus(String department, EmployeeStatus status);
    
    // Tìm theo position và status
    List<Employee> findByPositionAndStatus(String position, EmployeeStatus status);
    
    // Tìm theo phòng ban, chức vụ và status
    List<Employee> findByDepartmentAndPositionAndStatus(String department, String position, EmployeeStatus status);
    
    // Tìm theo khoảng lương
    List<Employee> findByBaseSalaryBetween(BigDecimal minSalary, BigDecimal maxSalary);
    
    // Tìm theo phòng ban và khoảng lương
    List<Employee> findByDepartmentAndBaseSalaryBetween(String department, BigDecimal minSalary, BigDecimal maxSalary);
    
    // Tìm theo chức vụ và khoảng lương
    List<Employee> findByPositionAndBaseSalaryBetween(String position, BigDecimal minSalary, BigDecimal maxSalary);
    
    // Tìm theo phòng ban, chức vụ và khoảng lương
    List<Employee> findByDepartmentAndPositionAndBaseSalaryBetween(String department, String position, BigDecimal minSalary, BigDecimal maxSalary);
    
    // Tìm kiếm theo tên hoặc email (case-insensitive)
    @Query("SELECT e FROM Employee e WHERE LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Employee> searchByNameOrEmail(@Param("search") String search);
    
    // Tìm kiếm theo tên hoặc email kết hợp với department
    @Query("SELECT e FROM Employee e WHERE (LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND e.department = :department")
    List<Employee> searchByNameOrEmailAndDepartment(@Param("search") String search, @Param("department") String department);
    
    // Tìm kiếm theo tên hoặc email kết hợp với position
    @Query("SELECT e FROM Employee e WHERE (LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND e.position = :position")
    List<Employee> searchByNameOrEmailAndPosition(@Param("search") String search, @Param("position") String position);
    
    // Tìm kiếm theo tên hoặc email kết hợp với status
    @Query("SELECT e FROM Employee e WHERE (LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND e.status = :status")
    List<Employee> searchByNameOrEmailAndStatus(@Param("search") String search, @Param("status") EmployeeStatus status);
    
    // Tìm kiếm theo tên hoặc email kết hợp với department và position
    @Query("SELECT e FROM Employee e WHERE (LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND e.department = :department AND e.position = :position")
    List<Employee> searchByNameOrEmailAndDepartmentAndPosition(@Param("search") String search, @Param("department") String department, @Param("position") String position);
    
    // Tìm kiếm theo tên hoặc email kết hợp với department và status
    @Query("SELECT e FROM Employee e WHERE (LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND e.department = :department AND e.status = :status")
    List<Employee> searchByNameOrEmailAndDepartmentAndStatus(@Param("search") String search, @Param("department") String department, @Param("status") EmployeeStatus status);
    
    // Tìm kiếm theo tên hoặc email kết hợp với position và status
    @Query("SELECT e FROM Employee e WHERE (LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND e.position = :position AND e.status = :status")
    List<Employee> searchByNameOrEmailAndPositionAndStatus(@Param("search") String search, @Param("position") String position, @Param("status") EmployeeStatus status);
    
    // Tìm kiếm theo tên hoặc email kết hợp với department, position và status
    @Query("SELECT e FROM Employee e WHERE (LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND e.department = :department AND e.position = :position AND e.status = :status")
    List<Employee> searchByNameOrEmailAndDepartmentAndPositionAndStatus(@Param("search") String search, @Param("department") String department, @Param("position") String position, @Param("status") EmployeeStatus status);
    
    // Đếm số lượng nhân viên theo status
    long countByStatus(EmployeeStatus status);
    
    // Kiểm tra email đã tồn tại chưa
    boolean existsByEmail(String email);
    
    // Tìm theo employeeId (String)
    Optional<Employee> findByEmployeeId(String employeeId);
    
    // Tìm theo email
    Optional<Employee> findByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE " +
            "(:keyword IS NULL OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:department IS NULL OR :department = '' OR e.department = :department)")
    List<Employee> searchEmployees(@Param("keyword") String keyword,
                                   @Param("department") String department);

    @Query(value = """
    SELECT
        e.id AS employeeId,
        e.full_name AS fullName,
        e.department AS department,
        e.position AS position,
        ee.average_score AS latestScore,
        ee.evaluation_date AS lastEvaluationDate,
        ee.id AS lastEvaluationId
    FROM employees e
    LEFT JOIN LATERAL (
        SELECT ev.*
        FROM evaluation ev
        WHERE ev.employee_id = e.id
        ORDER BY ev.evaluation_date DESC, ev.id DESC
        LIMIT 1
    ) ee ON TRUE
    
    WHERE (:keyword IS NULL 
        OR e.full_name ILIKE CONCAT('%', :keyword, '%') 
        OR e.position ILIKE CONCAT('%', :keyword, '%')
    )
    AND (:department IS NULL OR e.department ILIKE CONCAT('%', :department, '%'))
    """, nativeQuery = true)
    List<EmployeeEvaluationSummaryDTO> findEmployeeSummariesWithLatestEvaluation(
            @Param("keyword") String keyword,
            @Param("department") String department);

}

