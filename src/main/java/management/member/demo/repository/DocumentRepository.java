package management.member.demo.repository;

import management.member.demo.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByCategory(String category);
    
    @Query("SELECT d FROM Document d WHERE " +
           "(:category IS NULL OR d.category = :category) AND " +
           "(:search IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Document> findByFilters(@Param("category") String category, @Param("search") String search);
    
    List<Document> findByCategoryAndAccessLevel(String category, String accessLevel);
}

