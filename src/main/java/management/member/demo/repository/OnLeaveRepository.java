package management.member.demo.repository;

import management.member.demo.enums.OnLeaveStatus;
import management.member.demo.entity.OnLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OnLeaveRepository extends JpaRepository<OnLeave, Long> {
    List<OnLeave> findByEmployeeId(Long employeeId);
    
    List<OnLeave> findByOnLeaveStatus(OnLeaveStatus status);

    long countByOnLeaveStatus(OnLeaveStatus status);
    
    List<OnLeave> findByEmployeeIdAndOnLeaveStatus(Long employeeId, OnLeaveStatus status);
    
    @Query("SELECT ol FROM OnLeave ol WHERE ol.startDate >= :startDate AND ol.endDate <= :endDate")
    List<OnLeave> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT ol FROM OnLeave ol WHERE ol.employee.id = :employeeId AND ol.startDate >= :startDate AND ol.endDate <= :endDate")
    List<OnLeave> findByEmployeeIdAndDateRange(@Param("employeeId") Long employeeId, 
                                                @Param("startDate") LocalDate startDate, 
                                                @Param("endDate") LocalDate endDate);
    // Trong interface OnLeaveRepository
    @Query("SELECT r.onLeaveStatus, COUNT(r) FROM OnLeave r GROUP BY r.onLeaveStatus")
    List<Object[]> countRequestGroupedByStatus();

<<<<<<< Updated upstream
    // Lấy tất cả đơn nghỉ phép của 1 employee
    @Query("SELECT o FROM OnLeave o WHERE o.employee.id = :employeeId")
    List<OnLeave> findByEmployee_Id(Long employeeId);

    // Kiểm tra employee có dữ liệu nghỉ phép không
    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM OnLeave o WHERE o.employee.id = :employeeId")
    boolean existsByEmployee_Id(Long employeeId);

=======
    // Đếm nhân viên đang nghỉ phép hôm nay (status = APPROVED và startDate <= today <= endDate)
    @Query("SELECT COUNT(DISTINCT ol.employee.id) FROM OnLeave ol " +
            "WHERE ol.onLeaveStatus = :status " +
            "AND ol.startDate IS NOT NULL " +
            "AND ol.endDate IS NOT NULL " +
            "AND ol.employee IS NOT NULL " +
            "AND ol.startDate <= :today " +
            "AND ol.endDate >= :today")
    long countEmployeesOnLeaveToday(@Param("status") OnLeaveStatus status,
                                    @Param("today") LocalDate today);
>>>>>>> Stashed changes
}
