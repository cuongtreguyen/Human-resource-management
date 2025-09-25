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

}
