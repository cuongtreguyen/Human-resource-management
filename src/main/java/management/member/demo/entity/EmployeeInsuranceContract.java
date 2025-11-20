package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "employee_insurance_contracts")
public class EmployeeInsuranceContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID nhân viên */
    @NotNull
    @Column(name = "employee_id")
    private Long employeeId;

    /** Số hợp đồng */
    @NotBlank
    @Size(max = 100)
    @Column(name = "contract_number", unique = true)
    private String contractNumber;

    /** Ngày bắt đầu */
    @NotNull
    @Column(name = "start_date")
    private LocalDate startDate;

    /** Ngày kết thúc */
    @NotNull
    @Column(name = "end_date")
    private LocalDate endDate;

    /** Mức độ bao phủ */
    @NotBlank
    @Size(max = 50)
    @Column(name = "coverage")
    private String coverage;

    /** Mô tả */
    @Size(max = 1000)
    @Column(name = "description")
    private String description;
}
