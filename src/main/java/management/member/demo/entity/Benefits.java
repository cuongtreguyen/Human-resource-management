package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.BenefitsStatus;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "benefits")
public class Benefits {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Size(max = 50)
    @Column(name = "benefit_id", unique = true, nullable = false, length = 50)
    private String benefitId;
    
    @NotNull
    @Size(max = 255)
    @Column(name = "benefit_name", nullable = false)
    private String benefitName;
    
    @Size(max = 1000)
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "number_of_employees")
    private Integer numberOfEmployees;
    
    @Size(max = 500)
    @Column(name = "coverage", length = 500)
    private String coverage;
    
    @Column(name = "allowance_amount", precision = 19, scale = 2)
    private BigDecimal allowanceAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private BenefitsStatus status;
}
