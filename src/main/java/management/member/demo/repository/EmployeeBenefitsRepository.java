package management.member.demo.repository;

import management.member.demo.entity.EmployeeBenefits;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeBenefitsRepository extends JpaRepository<EmployeeBenefits, Long> {
    List<EmployeeBenefits> findByEmployeeId(Long employeeId);

}
