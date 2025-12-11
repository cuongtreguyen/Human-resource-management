package management.member.demo.repository;

import management.member.demo.entity.KanbanActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KanbanActivityRepository extends JpaRepository<KanbanActivity, Long> {

    List<KanbanActivity> findByCardIdOrderByCreatedAtDesc(Long cardId);

    List<KanbanActivity> findByBoardIdOrderByCreatedAtDesc(Long boardId);

    Page<KanbanActivity> findByBoardIdOrderByCreatedAtDesc(Long boardId, Pageable pageable);

    void deleteByCardId(Long cardId);
}
