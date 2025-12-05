package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.BenefitsStatus;
import org.hibernate.annotations.Formula;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "employee_benefits")
public class EmployeeBenefits {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** Quan hệ Many-to-One với Employee: 1 nhân viên có thể có nhiều benefit */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id", nullable = false)
    private Employee employee;

    /** Lấy employeeId dạng String từ employee entity (không lưu vào DB, read-only) */
    @Formula("(SELECT e.employee_id FROM employees e WHERE e.employee_id = employee_id)")
    @Getter
    @Setter(AccessLevel.NONE) // Không tạo setter vì @Formula là read-only
    @Transient // Đánh dấu không persist vào DB
    private String employeeId;
    
    /** Quan hệ Many-to-One với Benefits: 1 benefit template có thể được gán cho nhiều nhân viên */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "benefit_id", referencedColumnName = "benefit_id", nullable = false)
    private Benefits benefit;

    @Column(name = "grant_date")
    private LocalDate grantDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private BenefitsStatus status;
}
