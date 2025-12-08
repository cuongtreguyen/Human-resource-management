package management.member.demo.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeEvaluationScoreDTO {
    String employeeName;
    Double percentage; // Phần trăm (0-100), tính từ averageScore: (averageScore / 5) * 100
}

