package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Getter
@Setter
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    // Người được đánh giá
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    Employee employee;

    // Người thực hiện đánh giá (Quản lý)
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id", nullable = false)
    Employee evaluator;

    @NotNull
    @Column(name = "evaluation_date", nullable = false)
    LocalDate evaluationDate;

    // Các điểm thành phần (1-5)
    @Min(value = 1, message = "Điểm đánh giá phải từ 1 đến 5")
    @Max(value = 5, message = "Điểm đánh giá phải từ 1 đến 5")
    @Column(name = "work_performance_score")
    Double workPerformanceScore; // Hiệu suất
    @Min(value = 1, message = "Điểm đánh giá phải từ 1 đến 5")
    @Max(value = 5, message = "Điểm đánh giá phải từ 1 đến 5")
    @Column(name = "teamwork_score")
    Double teamworkScore;        // Làm việc nhóm
    @Min(value = 1, message = "Điểm đánh giá phải từ 1 đến 5")
    @Max(value = 5, message = "Điểm đánh giá phải từ 1 đến 5")
    @Column(name = "attitude_score")
    Double attitudeScore;        // Thái độ

    @Min(value = 1, message = "Điểm trung bình phải từ 1 đến 5")
    @Max(value = 5, message = "Điểm trung bình phải từ 1 đến 5")
    @Column(name = "average_score")
    Double averageScore;         // Điểm trung bình (Lưu cứng để query cho nhanh)

    @Column(columnDefinition = "TEXT")
    String strengths;            // Điểm mạnh

    @Column(columnDefinition = "TEXT")
    String goals;                // Mục tiêu cải thiện

    @Column(name = "created_at")
    LocalDate createdAt;
}