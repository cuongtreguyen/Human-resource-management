package management.member.demo.repository;

import management.member.demo.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    
    /**
     * Tìm Payroll theo code
     */
    Optional<Payroll> findByCode(String code);
}
