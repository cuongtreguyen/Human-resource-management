package management.member.demo.repository;

import management.member.demo.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    // Tìm bài đánh giá mới nhất của nhân viên
    Optional<Evaluation> findTopByEmployeeIdOrderByEvaluationDateDesc(Long employeeId);
}