package management.member.demo.repository;

import management.member.demo.entity.SupportRequest;
import management.member.demo.enums.SupportCategory;
import management.member.demo.enums.SupportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {

    // API Tìm kiếm tổng hợp (Keyword + Category + Status)
    @Query("SELECT s FROM SupportRequest s WHERE " +
            "(:keyword IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.requester.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:category IS NULL OR s.category = :category) " +
            "AND (:status IS NULL OR s.status = :status)")
    List<SupportRequest> searchRequests(@Param("keyword") String keyword,
                                        @Param("category") SupportCategory category,
                                        @Param("status") SupportStatus status);

    // API Đếm trạng thái
    long countByStatus(SupportStatus status);
}