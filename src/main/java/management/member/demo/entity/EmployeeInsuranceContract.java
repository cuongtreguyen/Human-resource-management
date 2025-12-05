package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Formula;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "employee_insurance_contracts")
public class EmployeeInsuranceContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Quan hệ Many-to-One với Employee: 1 nhân viên có thể có nhiều insurance contract */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id", nullable = false)
    private Employee employee;

    /** Lấy employeeId dạng String từ employee entity (không lưu vào DB, read-only) */
    @Formula("(SELECT e.employee_id FROM employees e WHERE e.employee_id = employee_id)")
    @Getter
    @Setter(AccessLevel.NONE) // Không tạo setter vì @Formula là read-only
    @Transient // Đánh dấu không persist vào DB
    private String employeeId;

    /** Quan hệ Many-to-One với InsuranceContract: 1 contract template có thể được gán cho nhiều nhân viên */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private InsuranceContract contract;

    /** Ngày bắt đầu */
    @NotNull
    @Column(name = "effective", nullable = false)
    private LocalDate effective;

    /** Ngày kết thúc */
    @NotNull
    @Column(name = "expiry", nullable = false)
    private LocalDate expiry;

    @Column(name = "grant_date")
    private LocalDate grantDate;
}
