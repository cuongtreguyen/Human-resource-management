package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.InsuranceContractStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "insurance_contracts")
public class InsuranceContract {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Size(max = 255)
    @Column(name = "insurence_name", nullable = false, unique = true)
    private String insurenceName;
    
    @NotNull
    @Column(name = "employer_rate", precision = 19, scale = 2, nullable = false)
    private BigDecimal employerRate;
    
    @NotNull
    @Column(name = "employee_rate", precision = 19, scale = 2, nullable = false)
    private BigDecimal employeeRate;
    
    @Size(max = 1000)
    @Column(name = "provider", length = 1000)
    private String provider;
    
    /** Ngày bắt đầu */
    @NotNull
    @Column(name = "effective", nullable = false)
    private LocalDate effective;
    
    /** Ngày kết thúc */
    @NotNull
    @Column(name = "expiry", nullable = false)
    private LocalDate expiry;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InsuranceContractStatus status;
}
