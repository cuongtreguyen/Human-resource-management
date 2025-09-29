package management.member.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class EmployeeRequest {
    @NotBlank
    @Size(max = 150)
    private String fullName;

    @Size(max = 255)
    private String profilePicture;

    @Email
    @Size(max = 120)
    private String email;

    @Size(max = 30)
    private String phoneNumber;

    @Size(max = 255)
    private String address;

    private LocalDate startDate;

    @Size(max = 50)
    private String employeeId;

    @Size(max = 100)
    private String department;

    @Size(max = 100)
    private String position;

    private BigDecimal salary;

    @Size(max = 1000)
    private String skill;

    @Size(max = 1000)
    private String certificate;

    @Size(max = 50)
    private String status;
}
