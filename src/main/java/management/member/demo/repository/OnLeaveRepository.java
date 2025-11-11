package management.member.demo.repository;

import management.member.demo.entity.OnLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OnLeaveRepository extends JpaRepository<OnLeave, Long> {
    List<OnLeave> findByEmployeeId(Long employeeId);
}
