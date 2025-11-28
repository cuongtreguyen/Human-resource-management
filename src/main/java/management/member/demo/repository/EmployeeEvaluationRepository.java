package management.member.demo.repository;

import management.member.demo.entity.EmployeeEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeEvaluationRepository extends JpaRepository<EmployeeEvaluation, Long> {
    
    @Query("SELECT ee FROM EmployeeEvaluation ee WHERE " +
           "(:employeeId IS NULL OR ee.employee.id = :employeeId) AND " +
           "(:period IS NULL OR ee.period = :period)")
    List<EmployeeEvaluation> findByFilters(@Param("employeeId") Long employeeId, @Param("period") String period);
}

