package management.member.demo.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
public class EmployeeEvaluationSummaryDTO {
    Long employeeId;
    String fullName;
    String department;
    String position;
    String avatar; // Nếu có

    // Thông tin đánh giá gần nhất (có thể null nếu chưa đánh giá lần nào)
    Double latestScore;
    LocalDate lastEvaluationDate;
    Long lastEvaluationId; // Để bấm vào xem chi tiết
}