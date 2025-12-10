package management.member.demo.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeByDepartmentDTO {
    String fullName;
    String department;
}

