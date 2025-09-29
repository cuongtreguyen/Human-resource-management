package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class EmployeeResponse {
    private Long id;
    private String fullName;
    private String profilePicture;
    private String email;
    private String phoneNumber;
    private String address;
    private LocalDate startDate;
    private String employeeId;
    private String department;
    private String position;
    private BigDecimal salary;
    private String skill;
    private String certificate;
    private String status;
}
