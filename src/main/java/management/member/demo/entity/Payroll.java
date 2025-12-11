package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import management.member.demo.enums.PayrollStatus;

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
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, unique = true)
    private String code;

    /** Kỳ lương tính theo tháng/năm (ví dụ: 2025-10-01) */
    @NotNull
    @Column(name = "period")
    private LocalDate period;

    /** Ngày phát hành bảng lương */
    @Column(name = "created_date")
    private LocalDate createdDate;

    /** Ngày chi trả lương */
    @Column(name = "payment_date")
    private LocalDate paymentDate;

    /** Tổng chi phí lương trong kỳ (tổng tất cả netSalary của nhân viên) */
    @DecimalMin(value = "0.0", message = "Tổng chi phí lương phải lớn hơn hoặc bằng 0")
    @Column(name = "total_amount", precision = 19, scale = 2)
    private BigDecimal totalAmount;

    /** Trạng thái bảng lương (PENDING, APPROVED, PAID, CANCELLED, ...) */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PayrollStatus status;

    /** Ghi chú (ví dụ: "Payroll tháng 10/2025 - bao gồm thưởng lễ") */
    @Size(max = 1000)
    @Column(name = "note")
    private String note;

    /**
     * Danh sách bản ghi lương của từng nhân viên trong kỳ này
     * Một payroll có thể có nhiều salary record.
     */
    @OneToMany(mappedBy = "payroll", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Salary> salaries;
}
