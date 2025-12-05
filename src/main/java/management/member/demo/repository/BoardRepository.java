package management.member.demo.repository;

import management.member.demo.entity.Board;
import management.member.demo.enums.BoardStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    // Chỉ lấy board đang hoạt động
    List<Board> findByStatus(BoardStatus status);

    // Tìm kiếm trong những board đang hoạt động
    List<Board> findByNameContainingIgnoreCaseAndStatus(String name, BoardStatus status);
}