package management.member.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.Enum.EmployeeStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@Builder
@Getter
@Setter
public class EmployeeRequest {
    @NotBlank
    @Size(max = 100)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    private String lastName;

    @Email
    @NotBlank
    @Size(max = 120)
    private String email;

    @Size(max = 30)
    private String phone;

    @NotBlank
    @Size(max = 50)
    private String employeeCode;

    @NotBlank
    @Size(max = 100)
    private String department;

    @NotBlank
    @Size(max = 100)
    private String position;

    @NotNull
    private LocalDate hireDate;

    @NotBlank
    @Size(max = 50)
    private EmployeeStatus status;

    @NotNull
    private BigDecimal baseSalary;
}
