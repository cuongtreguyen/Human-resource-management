package management.member.demo.repository;

import management.member.demo.entity.RecruitmentApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecruitmentApplicationRepository extends JpaRepository<RecruitmentApplication, Long> {
    
    @Query("SELECT ra FROM RecruitmentApplication ra WHERE " +
           "(:positionId IS NULL OR ra.position.id = :positionId) AND " +
           "(:status IS NULL OR ra.status = :status)")
    List<RecruitmentApplication> findByFilters(@Param("positionId") Long positionId, @Param("status") String status);
    
    @Query("SELECT COUNT(ra) FROM RecruitmentApplication ra WHERE ra.position.id = :positionId")
    Long countByPositionId(@Param("positionId") Long positionId);
}

