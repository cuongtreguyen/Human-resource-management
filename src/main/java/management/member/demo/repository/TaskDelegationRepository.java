package management.member.demo.repository;

import management.member.demo.entity.TaskDelegation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskDelegationRepository extends JpaRepository<TaskDelegation, Long> {
    
    @Query("SELECT td FROM TaskDelegation td WHERE " +
           "(:employeeId IS NULL OR td.fromEmployee.id = :employeeId OR td.toEmployee.id = :employeeId) AND " +
           "(:status IS NULL OR td.status = :status)")
    List<TaskDelegation> findByFilters(@Param("employeeId") Long employeeId, @Param("status") String status);
}

