package management.member.demo.repository;

import management.member.demo.entity.InsuranceContract;
import management.member.demo.enums.InsuranceContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InsuranceContractRepository extends JpaRepository<InsuranceContract, Long> {
    /**
     * Tìm InsuranceContract theo insurenceName
     */
    Optional<InsuranceContract> findByInsurenceName(String insurenceName);
    
    /**
     * Tìm tất cả InsuranceContract theo status
     */
    List<InsuranceContract> findByStatus(InsuranceContractStatus status);
    
    /**
     * Kiểm tra tồn tại theo insurenceName
     */
    boolean existsByInsurenceName(String insurenceName);
}

