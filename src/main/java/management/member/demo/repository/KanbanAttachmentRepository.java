package management.member.demo.repository;

import management.member.demo.entity.KanbanAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KanbanAttachmentRepository extends JpaRepository<KanbanAttachment, Long> {

    List<KanbanAttachment> findByCardIdOrderByUploadedAtDesc(Long cardId);

    @Query("SELECT COUNT(a) FROM KanbanAttachment a WHERE a.card.id = :cardId")
    int countByCardId(@Param("cardId") Long cardId);

    void deleteByCardId(Long cardId);
}
