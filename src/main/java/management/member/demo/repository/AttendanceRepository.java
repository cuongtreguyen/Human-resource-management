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
}
