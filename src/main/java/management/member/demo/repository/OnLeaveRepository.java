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
}
