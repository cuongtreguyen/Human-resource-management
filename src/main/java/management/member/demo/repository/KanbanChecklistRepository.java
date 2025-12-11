package management.member.demo.repository;

import management.member.demo.entity.KanbanChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KanbanChecklistRepository extends JpaRepository<KanbanChecklist, Long> {

    List<KanbanChecklist> findByCardIdOrderByPositionAsc(Long cardId);

    @Query("SELECT MAX(c.position) FROM KanbanChecklist c WHERE c.card.id = :cardId")
    Integer findMaxPositionByCardId(@Param("cardId") Long cardId);

    @Query("SELECT COUNT(c) FROM KanbanChecklist c WHERE c.card.id = :cardId")
    int countByCardId(@Param("cardId") Long cardId);

    @Query("SELECT COUNT(c) FROM KanbanChecklist c WHERE c.card.id = :cardId AND c.completed = true")
    int countCompletedByCardId(@Param("cardId") Long cardId);

    void deleteByCardId(Long cardId);
}
