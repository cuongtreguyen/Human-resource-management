package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeEvaluationSummaryDTO {
    Long employeeId;
    String fullName;
    String department;
    String position;

    // Thông tin đánh giá gần nhất (có thể null nếu chưa đánh giá lần nào)
    Double latestScore;
    LocalDate lastEvaluationDate;
    Long lastEvaluationId; // Để bấm vào xem chi tiết
}