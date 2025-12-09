package management.member.demo.repository;

import management.member.demo.entity.KanbanLabel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KanbanLabelRepository extends JpaRepository<KanbanLabel, Long> {

    List<KanbanLabel> findByBoardId(Long boardId);

    List<KanbanLabel> findByIdIn(List<Long> ids);
}
