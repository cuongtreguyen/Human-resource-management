package management.member.demo.repository;

import management.member.demo.Enum.TaskStatus;
import management.member.demo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTitleContainingIgnoreCase(String title);
    long countByTaskStatus(TaskStatus status);

    // Lấy startDate, endedAt cho các task COMPLETED (dùng để tính average days)
    @Query("SELECT t.createdAt, t.endedAt FROM Task t " +
            "WHERE t.taskStatus = :taskStatus " +
            "AND (:start IS NULL OR t.createdAt >= :start) " +
            "AND (:end IS NULL OR t.endedAt <= :end)")
    List<Object[]> findStartEndByStatusBetweenDates(@Param("taskStatus") TaskStatus taskStatus,
                                                    @Param("start") LocalDate start,
                                                    @Param("end") LocalDate end);

    // COUNT GROUP BY taskStatus với filter thời gian
    @Query("SELECT t.taskStatus, COUNT(t) FROM Task t " +
            "WHERE (:start IS NULL OR t.createdAt >= :start) " +
            "AND (:end IS NULL OR t.endedAt <= :end) " +
            "GROUP BY t.taskStatus")
    List<Object[]> countTasksGroupedByStatusBetweenDates(@Param("start") LocalDate start,
                                                         @Param("end") LocalDate end);

    // COUNT GROUP BY employee.id và employee.fullName
    @Query("SELECT t.employee.id, t.employee.fullName, COUNT(t) FROM Task t " +
            "WHERE (:start IS NULL OR t.createdAt >= :start) " +
            "AND (:end IS NULL OR t.endedAt <= :end) " +
            "GROUP BY t.employee.id, t.employee.fullName")
    List<Object[]> countTasksGroupedByEmployeeBetweenDates(@Param("start") LocalDate start,
                                                           @Param("end") LocalDate end);

    // COUNT GROUP BY employee.id, employee.fullName với trạng thái cụ thể
    @Query("SELECT t.employee.id, t.employee.fullName, COUNT(t) FROM Task t " +
            "WHERE t.taskStatus = :taskStatus " +
            "AND (:start IS NULL OR t.createdAt >= :start) " +
            "AND (:end IS NULL OR t.endedAt <= :end) " +
            "GROUP BY t.employee.id, t.employee.fullName")
    List<Object[]> countTasksGroupedByEmployeeAndStatusBetweenDates(@Param("taskStatus") TaskStatus taskStatus,
                                                                    @Param("start") LocalDate start,
                                                                    @Param("end") LocalDate end);
}
