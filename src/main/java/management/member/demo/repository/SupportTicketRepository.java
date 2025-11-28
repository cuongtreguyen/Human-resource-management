package management.member.demo.repository;

import management.member.demo.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    
    @Query("SELECT st FROM SupportTicket st WHERE " +
           "(:employeeId IS NULL OR st.employee.id = :employeeId) AND " +
           "(:status IS NULL OR st.status = :status) AND " +
           "(:category IS NULL OR st.category = :category)")
    List<SupportTicket> findByFilters(@Param("employeeId") Long employeeId, 
                                     @Param("status") String status, 
                                     @Param("category") String category);
}

