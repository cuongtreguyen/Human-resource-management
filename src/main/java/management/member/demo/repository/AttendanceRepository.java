package management.member.demo.repository;

import management.member.demo.entity.Attendance;
import management.member.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    // Query theo userId (tương thích với hệ thống cũ)
    List<Attendance> findByUserId(String userId);

    List<Attendance> findByAttendanceDate(LocalDate date);

    List<Attendance> findByUserIdAndAttendanceDate(String userId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.userId = :userId AND a.attendanceDate BETWEEN :startDate AND :endDate")
    List<Attendance> findByUserIdAndDateRange(
            @Param("userId") String userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate BETWEEN :startDate AND :endDate")
    List<Attendance> findByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Query theo Employee
    List<Attendance> findByEmployee(Employee employee);

    List<Attendance> findByEmployeeId(Long employeeId);

    List<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.attendanceDate BETWEEN :startDate AND :endDate")
    List<Attendance> findByEmployeeIdAndDateRange(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.attendanceDate = :date")
    Optional<Attendance> findByEmployeeIdAndDate(
            @Param("employeeId") Long employeeId,
            @Param("date") LocalDate date
    );

    /**
     * Lấy tất cả Attendance records của employee có status = LATE
     */
    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.status = :status")
    List<Attendance> findByEmployeeIdAndStatus(
            @Param("employeeId") Long employeeId,
            @Param("status") management.member.demo.enums.AttendenceStatus status
    );

    /**
     * Lấy tất cả attendance với Employee được load (JOIN FETCH)
     */
    @Query("SELECT DISTINCT a FROM Attendance a LEFT JOIN FETCH a.employee")
    List<Attendance> findAllWithEmployee();

    /**
     * Filter attendance theo ngày/tháng/năm
     * - Nếu có day, month, year: filter theo ngày cụ thể
     * - Nếu chỉ có month, year: filter theo tháng
     * - Nếu chỉ có year: filter theo năm
     * - Nếu không có gì: trả về tất cả
     */
    @Query("SELECT DISTINCT a FROM Attendance a LEFT JOIN FETCH a.employee WHERE " +
            "(:day IS NULL OR DAY(a.attendanceDate) = :day) AND " +
            "(:month IS NULL OR MONTH(a.attendanceDate) = :month) AND " +
            "(:year IS NULL OR YEAR(a.attendanceDate) = :year)")
    List<Attendance> findByDateFilter(
            @Param("day") Integer day,
            @Param("month") Integer month,
            @Param("year") Integer year
    );

    /**
     * Tìm attendance theo fullName (ignore case)
     */
    @Query("SELECT DISTINCT a FROM Attendance a LEFT JOIN FETCH a.employee WHERE LOWER(a.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))")
    List<Attendance> findByFullNameIgnoreCase(@Param("fullName") String fullName);

    /**
     * Tìm attendance theo fullName (ignore case) kết hợp với filter ngày/tháng/năm
     */
    @Query("SELECT DISTINCT a FROM Attendance a LEFT JOIN FETCH a.employee WHERE " +
            "LOWER(a.fullName) LIKE LOWER(CONCAT('%', :fullName, '%')) AND " +
            "(:day IS NULL OR DAY(a.attendanceDate) = :day) AND " +
            "(:month IS NULL OR MONTH(a.attendanceDate) = :month) AND " +
            "(:year IS NULL OR YEAR(a.attendanceDate) = :year)")
    List<Attendance> findByFullNameAndDateFilter(
            @Param("fullName") String fullName,
            @Param("day") Integer day,
            @Param("month") Integer month,
            @Param("year") Integer year
    );
}
