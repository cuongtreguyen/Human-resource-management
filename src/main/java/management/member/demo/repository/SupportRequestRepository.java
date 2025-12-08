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

    @Query("SELECT s FROM SupportRequest s WHERE " +
            "(:keyword IS NULL OR LOWER(s.title) LIKE :pattern OR LOWER(s.requester.fullName) LIKE :pattern) " +
            "AND (:category IS NULL OR s.category = :category) " +
            "AND (:status IS NULL OR s.status = :status)")
    List<SupportRequest> searchRequests(@Param("keyword") String keyword,   // Dùng để check null
                                        @Param("pattern") String pattern,   // Dùng để so sánh LIKE
                                        @Param("category") SupportCategory category,
                                        @Param("status") SupportStatus status);

    // API Đếm trạng thái
    long countByStatus(SupportStatus status);
}