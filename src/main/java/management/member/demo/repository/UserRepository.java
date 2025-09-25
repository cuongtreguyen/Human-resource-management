package management.member.demo.repository;

import management.member.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface cho User entity
 * Cung cấp các method để truy vấn và thao tác với dữ liệu User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Tìm user theo username
     * @param username tên đăng nhập cần tìm
     * @return Optional chứa User nếu tìm thấy
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Tìm user theo email
     * @param email địa chỉ email cần tìm
     * @return Optional chứa User nếu tìm thấy
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Kiểm tra xem username đã tồn tại chưa
     * @param username tên đăng nhập cần kiểm tra
     * @return true nếu đã tồn tại, false nếu chưa
     */
    boolean existsByUsername(String username);
    
    /**
     * Kiểm tra xem email đã tồn tại chưa
     * @param email địa chỉ email cần kiểm tra
     * @return true nếu đã tồn tại, false nếu chưa
     */
    boolean existsByEmail(String email);
    
    /**
     * Tìm user đang hoạt động theo username
     * @param username tên đăng nhập cần tìm
     * @return Optional chứa User đang hoạt động nếu tìm thấy
     */
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.isActive = true")
    Optional<User> findActiveUserByUsername(@Param("username") String username);
    
    /**
     * Đếm số lượng user theo role
     * @param role vai trò cần đếm
     * @return số lượng user có role tương ứng
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") User.Role role);
}
