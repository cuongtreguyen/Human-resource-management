package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.SalaryStatus;

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

    /** Quan hệ Many-to-One với Employee: 1 nhân viên có thể có nhiều bản ghi lương */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    /** Lương cơ bản */
    @NotNull
    @Column(name = "base_salary", precision = 19, scale = 2)
    private BigDecimal baseSalary;

    /** Phụ cấp */
    @Column(name = "allowance", precision = 19, scale = 2)
    private BigDecimal allowance;

    /** Lương làm thêm giờ */
    @Column(name = "ot_pay", precision = 19, scale = 2)
    private BigDecimal otPay;

    /** Thưởng */
    @Column(name = "bonus", precision = 19, scale = 2)
    private BigDecimal bonus;

    /** Tổng thu nhập (gross income) */
    @Column(name = "gross_income", precision = 19, scale = 2)
    private BigDecimal grossIncome;

    /** BHXH (Bảo hiểm xã hội) */
    @Column(name = "social_insurance", precision = 19, scale = 2)
    private BigDecimal socialInsurance;

    /** BHYT (Bảo hiểm y tế) */
    @Column(name = "health_insurance", precision = 19, scale = 2)
    private BigDecimal healthInsurance;

    /** BHTN (Bảo hiểm thất nghiệp) */
    @Column(name = "unemployment_insurance", precision = 19, scale = 2)
    private BigDecimal unemploymentInsurance;

    /** Tổng bảo hiểm */
    @Column(name = "total_insurance", precision = 19, scale = 2)
    private BigDecimal totalInsurance;

    /** Khấu trừ chung */
    @Column(name = "general_deductions", precision = 19, scale = 2)
    private BigDecimal generalDeductions;

    /** Thuế thu nhập cá nhân */
    @Column(name = "personal_income_tax", precision = 19, scale = 2)
    private BigDecimal personalIncomeTax;

    /** Tổng khấu trừ*/
    @Column(name = "total_deductions", precision = 19, scale = 2)
    private BigDecimal totalDeductions;

    /** Lương thực nhận */
    @NotNull
    @Column(name = "net_salary", precision = 19, scale = 2)
    private BigDecimal netSalary;

    
    /** Trạng thái lương */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SalaryStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_id")
    private Payroll payroll;

    /** Ngày thanh toán lương */
    @Column(name = "payment_date")
    private LocalDate paymentDate;

}
