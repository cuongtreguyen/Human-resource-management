package management.member.demo.repository;

import management.member.demo.entity.OverTime;
import management.member.demo.enums.OverTimeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface OverTimeRepository extends JpaRepository<OverTime, Long> {
    Long countByOvertimeStatus(OverTimeStatus status);
    List<OverTime> findByOvertimeStatus(OverTimeStatus status);
    @Query("""
    SELECT o FROM OverTime o
    WHERE LOWER(o.task.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(o.employee.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<OverTime> searchOvertime(@Param("keyword") String keyword);

    // Tìm overtime theo employee ID
    List<OverTime> findByEmployeeIdOrderByOtDateDesc(Long employeeId);

    // Tìm overtime theo employee entity
    List<OverTime> findByEmployeeOrderByOtDateDesc(management.member.demo.entity.Employee employee);

    /**
     * Tìm tất cả OverTime đã được APPROVED của một employee trong khoảng thời gian
     * Dùng cho tính toán payroll
     */
    @Query("""
        SELECT o FROM OverTime o
        WHERE o.employee.id = :employeeId
          AND o.otDate >= :startDate
          AND o.otDate <= :endDate
          AND o.overtimeStatus = :status
        ORDER BY o.otDate ASC
    """)
    List<OverTime> findApprovedOvertimeByEmployeeAndDateRange(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") OverTimeStatus status
    );

}
