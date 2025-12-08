package management.member.demo.repository;

import management.member.demo.enums.TaskStatus;
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

    // 1. Sửa 'endedAt' thành 'deadline' (theo Entity cũ của bạn)
    @Query("SELECT t.createdAt, t.deadline FROM Task t " +
            "WHERE t.taskStatus = :taskStatus " +
            "AND (:start IS NULL OR t.createdAt >= :start) " +
            "AND (:end IS NULL OR t.deadline <= :end)")
    List<Object[]> findStartEndByStatusBetweenDates(@Param("taskStatus") TaskStatus taskStatus,
                                                    @Param("start") LocalDate start,
                                                    @Param("end") LocalDate end);

    // 2. Sửa 'endedAt' thành 'deadline'
    @Query("SELECT t.taskStatus, COUNT(t) FROM Task t " +
            "WHERE (:start IS NULL OR t.createdAt >= :start) " +
            "AND (:end IS NULL OR t.deadline <= :end) " +
            "GROUP BY t.taskStatus")
    List<Object[]> countTasksGroupedByStatusBetweenDates(@Param("start") LocalDate start,
                                                         @Param("end") LocalDate end);

    // 3. QUAN TRỌNG: Dùng JOIN t.employees e để lấy thông tin nhân viên
    @Query("SELECT e.id, e.fullName, COUNT(t) " +
            "FROM Task t " +
            "JOIN t.employees e " + // Join sang danh sách employees
            "WHERE (:start IS NULL OR t.createdAt >= :start) " +
            "AND (:end IS NULL OR t.deadline <= :end) " +
            "GROUP BY e.id, e.fullName")
    List<Object[]> countTasksGroupedByEmployeeBetweenDates(@Param("start") LocalDate start,
                                                           @Param("end") LocalDate end);

    // 4. QUAN TRỌNG: Tương tự, dùng JOIN cho query có filter status
    @Query("SELECT e.id, e.fullName, COUNT(t) " +
            "FROM Task t " +
            "JOIN t.employees e " + // Join sang danh sách employees
            "WHERE t.taskStatus = :taskStatus " +
            "AND (:start IS NULL OR t.createdAt >= :start) " +
            "AND (:end IS NULL OR t.deadline <= :end) " +
            "GROUP BY e.id, e.fullName")
    List<Object[]> countTasksGroupedByEmployeeAndStatusBetweenDates(@Param("taskStatus") TaskStatus taskStatus,
                                                                    @Param("start") LocalDate start,
                                                                    @Param("end") LocalDate end);

    // 1. Đếm tổng số task theo từng status (cho toàn hệ thống)
    // Result: [ [NEW, 10], [IN_PROGRESS, 5], ... ]
    @Query("SELECT t.taskStatus, COUNT(t) FROM Task t GROUP BY t.taskStatus")
    List<Object[]> countTotalTasksGroupedByStatus();

    @Query("SELECT t.taskStatus, COUNT(t) " +
            "FROM Task t " +
            "WHERE t.board.id = :boardId " + // Điều kiện lọc theo Board ID
            "GROUP BY t.taskStatus")
    List<Object[]> countTasksByBoardId(@Param("boardId") Long boardId);

    // Đếm số task quá hạn (deadline < hiện tại và status != COMPLETED)
    @Query("SELECT COUNT(t) FROM Task t " +
            "WHERE t.deadline < :currentDate " +
            "AND t.taskStatus != :completedStatus")
    long countOverdueTasks(@Param("currentDate") LocalDate currentDate,
                          @Param("completedStatus") TaskStatus completedStatus);

    // Lấy các task sắp đến hạn (deadline = tomorrow và status != COMPLETED)
    @Query("SELECT DISTINCT t FROM Task t " +
            "LEFT JOIN FETCH t.employees " +
            "WHERE t.deadline = :tomorrow " +
            "AND t.taskStatus != :completedStatus")
    List<Task> findUpcomingTasks(@Param("tomorrow") LocalDate tomorrow,
                                 @Param("completedStatus") TaskStatus completedStatus);
}