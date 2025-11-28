package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeCountResponseDTO {
    private Long totalEmployees;
    private Long activeEmployeesCount;
}

