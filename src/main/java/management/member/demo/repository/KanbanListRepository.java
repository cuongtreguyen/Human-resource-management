package management.member.demo.repository;

import management.member.demo.entity.KanbanList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KanbanListRepository extends JpaRepository<KanbanList, Long> {

    List<KanbanList> findByBoardIdAndArchivedFalseOrderByPositionAsc(Long boardId);

    List<KanbanList> findByBoardIdOrderByPositionAsc(Long boardId);

    @Query("SELECT MAX(l.position) FROM KanbanList l WHERE l.board.id = :boardId")
    Double findMaxPositionByBoardId(@Param("boardId") Long boardId);

    @Query("SELECT COUNT(l) FROM KanbanList l WHERE l.board.id = :boardId AND l.archived = false")
    int countByBoardIdAndArchivedFalse(@Param("boardId") Long boardId);
}
