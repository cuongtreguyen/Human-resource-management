package management.member.demo.repository;

import management.member.demo.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    @Query("SELECT al FROM AuditLog al WHERE " +
           "(:search IS NULL OR LOWER(al.details) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:type IS NULL OR :type = 'all' OR al.action = :type) AND " +
           "(:date IS NULL OR DATE(al.timestamp) = :date)")
    List<AuditLog> findByFilters(@Param("search") String search, 
                                  @Param("type") String type, 
                                  @Param("date") LocalDate date);
    
    @Query("SELECT al FROM AuditLog al WHERE " +
           "(:search IS NULL OR LOWER(al.details) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:type IS NULL OR :type = 'all' OR al.action = :type) AND " +
           "(:date IS NULL OR DATE(al.timestamp) = :date)")
    Page<AuditLog> findByFiltersPaginated(@Param("search") String search, 
                                          @Param("type") String type, 
                                          @Param("date") LocalDate date,
                                          Pageable pageable);
    
    @Query("SELECT al FROM AuditLog al WHERE al.employeeId = :employeeId")
    List<AuditLog> findByEmployeeId(@Param("employeeId") String employeeId);
    
    @Query("SELECT al.action, COUNT(al) FROM AuditLog al WHERE " +
           "(:search IS NULL OR LOWER(al.details) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:type IS NULL OR :type = 'all' OR al.action = :type) AND " +
           "(:date IS NULL OR DATE(al.timestamp) = :date) " +
           "GROUP BY al.action")
    List<Object[]> getActionCounts(@Param("search") String search, 
                                    @Param("type") String type, 
                                    @Param("date") LocalDate date);
    
    void deleteByTimestampBefore(LocalDateTime before);
}

