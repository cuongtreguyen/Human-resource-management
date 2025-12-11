package management.member.demo.repository;

import management.member.demo.entity.Board;
import management.member.demo.enums.BoardStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    // Chỉ lấy board đang hoạt động
    List<Board> findByStatus(BoardStatus status);

    // Tìm kiếm trong những board đang hoạt động
    List<Board> findByNameContainingIgnoreCaseAndStatus(String name, BoardStatus status);

    // Lấy boards với members đã được JOIN FETCH - đảm bảo members được load
    @Query("SELECT DISTINCT b FROM Board b LEFT JOIN FETCH b.members WHERE b.status = :status")
    List<Board> findByStatusWithMembers(@Param("status") BoardStatus status);

    // Tìm kiếm với members đã được JOIN FETCH
    @Query("SELECT DISTINCT b FROM Board b LEFT JOIN FETCH b.members WHERE LOWER(b.name) LIKE LOWER(CONCAT('%', :name, '%')) AND b.status = :status")
    List<Board> findByNameContainingAndStatusWithMembers(@Param("name") String name, @Param("status") BoardStatus status);

    // Lấy tất cả boards mà employee là member
    @Query("SELECT DISTINCT b FROM Board b LEFT JOIN FETCH b.members m WHERE m.id = :employeeId AND b.status = :status")
    List<Board> findByMemberIdAndStatus(@Param("employeeId") Long employeeId, @Param("status") BoardStatus status);
}