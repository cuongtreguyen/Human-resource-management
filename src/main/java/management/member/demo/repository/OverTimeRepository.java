package management.member.demo.repository;

import management.member.demo.entity.OverTime;
import management.member.demo.enums.OverTimeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

}
