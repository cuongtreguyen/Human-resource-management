package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.Enum.SalaryStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "salaries")
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID nhân viên */
    @NotNull
    @Column(name = "employee_id")
    private Long employeeId;

    /** Lương cơ bản */
    @NotNull
    @Column(name = "base_salary", precision = 19, scale = 2)
    private BigDecimal baseSalary;

    /** Phụ cấp */
    @Column(name = "allowance", precision = 19, scale = 2)
    private BigDecimal allowance;

    /** Lương làm thêm giờ */
    @Column(name = "overtime_pay", precision = 19, scale = 2)
    private BigDecimal overtimePay;

    /** Thưởng */
    @Column(name = "bonus", precision = 19, scale = 2)
    private BigDecimal bonus;

    /** Khấu trừ */
    @Column(name = "deduction", precision = 19, scale = 2)
    private BigDecimal deduction;

    /** Lương thực nhận */
    @NotNull
    @Column(name = "net_salary", precision = 19, scale = 2)
    private BigDecimal netSalary;

    /** Trạng thái lương */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SalaryStatus status;

    /** Ngày thanh toán */
    @NotNull
    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_id")
    private Payroll payroll;

}
