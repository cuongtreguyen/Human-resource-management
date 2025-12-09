package management.member.demo.repository;

import management.member.demo.entity.KanbanCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KanbanCardRepository extends JpaRepository<KanbanCard, Long> {

    List<KanbanCard> findByListIdAndArchivedFalseOrderByPositionAsc(Long listId);

    List<KanbanCard> findByListIdInAndArchivedFalseOrderByPositionAsc(List<Long> listIds);

    @Query("SELECT MAX(c.position) FROM KanbanCard c WHERE c.list.id = :listId")
    Double findMaxPositionByListId(@Param("listId") Long listId);

    @Query("SELECT MIN(c.position) FROM KanbanCard c WHERE c.list.id = :listId")
    Double findMinPositionByListId(@Param("listId") Long listId);

    @Query("SELECT COUNT(c) FROM KanbanCard c WHERE c.list.id = :listId AND c.archived = false")
    int countByListIdAndArchivedFalse(@Param("listId") Long listId);

    @Query("SELECT COUNT(c) FROM KanbanCard c WHERE c.list.board.id = :boardId AND c.archived = false")
    int countByBoardIdAndArchivedFalse(@Param("boardId") Long boardId);

    // Tìm các card có chứa labelId trong danh sách labelIds
    @Query("SELECT c FROM KanbanCard c WHERE :labelId MEMBER OF c.labelIds")
    List<KanbanCard> findByLabelIdsContaining(@Param("labelId") Long labelId);
}
