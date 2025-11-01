package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import management.member.demo.Enum.PayrollStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "payrolls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Mã kỳ lương, ví dụ "PAYROLL-2025-10" */
    @Column(nullable = false, unique = true)
    private String code;

    /** Kỳ lương tính theo tháng/năm (ví dụ: 2025-10-01) */
    private LocalDate period;

    /** Ngày phát hành bảng lương */
    private LocalDate createdDate;

    /** Tổng chi phí lương trong kỳ (tổng tất cả netSalary của nhân viên) */
    private BigDecimal totalAmount;

    /** Trạng thái bảng lương (PENDING, APPROVED, PAID, CANCELLED, ...) */
    @Enumerated(EnumType.STRING)
    private PayrollStatus status;

    /** Ghi chú (ví dụ: "Payroll tháng 10/2025 - bao gồm thưởng lễ") */
    private String note;

    /**
     * Danh sách bản ghi lương của từng nhân viên trong kỳ này
     * Một payroll có thể có nhiều salary record.
     */
    @OneToMany(mappedBy = "payroll", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Salary> salaries;
}
