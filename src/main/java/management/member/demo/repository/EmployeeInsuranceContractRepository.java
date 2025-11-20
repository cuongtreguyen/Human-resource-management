package management.member.demo.repository;

import management.member.demo.entity.EmployeeInsuranceContract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeInsuranceContractRepository extends JpaRepository<EmployeeInsuranceContract, Long> {
    List<EmployeeInsuranceContract> findByEmployeeId(Long employeeId);
}
