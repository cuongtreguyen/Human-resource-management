package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.time.LocalDate;

@Data
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

    // Constructor duy nhất cho native query - nhận java.sql.Date và convert sang LocalDate
    // Hibernate yêu cầu chỉ có 1 constructor với đúng 7 tham số để map với 7 cột trong query
    // Không dùng @Builder vì nó tạo constructor với LocalDate, gây xung đột
    public EmployeeEvaluationSummaryDTO(Long employeeId, String fullName, String department, String position,
                                       Double latestScore, Date lastEvaluationDate, Long lastEvaluationId) {
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.department = department;
        this.position = position;
        this.latestScore = latestScore;
        this.lastEvaluationDate = lastEvaluationDate != null ? lastEvaluationDate.toLocalDate() : null;
        this.lastEvaluationId = lastEvaluationId;
    }
}