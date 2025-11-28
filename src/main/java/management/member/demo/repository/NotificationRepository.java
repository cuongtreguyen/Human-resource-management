package management.member.demo.repository;

import management.member.demo.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByRead(Boolean read);
    
    List<Notification> findByType(String type);
    
    @Query("SELECT n FROM Notification n WHERE " +
           "(:read IS NULL OR n.read = :read) AND " +
           "(:type IS NULL OR n.type = :type)")
    List<Notification> findByFilters(@Param("read") Boolean read, @Param("type") String type);
    
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId")
    List<Notification> findByUserId(@Param("userId") String userId);
}

