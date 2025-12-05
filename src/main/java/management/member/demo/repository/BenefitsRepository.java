package management.member.demo.repository;

import management.member.demo.entity.Benefits;
import management.member.demo.enums.BenefitsStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BenefitsRepository extends JpaRepository<Benefits, Long> {
    /**
     * Tìm Benefits theo benefitId
     */
    Optional<Benefits> findByBenefitId(String benefitId);
    
    /**
     * Tìm Benefits theo benefitName
     */
    Optional<Benefits> findByBenefitName(String benefitName);
    
    /**
     * Tìm tất cả Benefits theo status
     */
    List<Benefits> findByStatus(BenefitsStatus status);
    
    /**
     * Kiểm tra tồn tại theo benefitId
     */
    boolean existsByBenefitId(String benefitId);
    
    /**
     * Kiểm tra tồn tại theo benefitName
     */
    boolean existsByBenefitName(String benefitName);
}

