package management.member.demo.repository;

import management.member.demo.entity.RecruitmentPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecruitmentPositionRepository extends JpaRepository<RecruitmentPosition, Long> {
    
    @Query("SELECT rp FROM RecruitmentPosition rp WHERE " +
           "(:status IS NULL OR rp.status = :status) AND " +
           "(:department IS NULL OR rp.department = :department)")
    List<RecruitmentPosition> findByFilters(@Param("status") String status, @Param("department") String department);
}

