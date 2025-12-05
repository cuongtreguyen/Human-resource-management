package management.member.demo.entity;

import jakarta.persistence.*;
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    Employee employee;

    // Người thực hiện đánh giá (Quản lý)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id")
    Employee evaluator;

    LocalDate evaluationDate;

    // Các điểm thành phần (1-5)
    Double workPerformanceScore; // Hiệu suất
    Double teamworkScore;        // Làm việc nhóm
    Double attitudeScore;        // Thái độ

    Double averageScore;         // Điểm trung bình (Lưu cứng để query cho nhanh)

    @Column(columnDefinition = "TEXT")
    String strengths;            // Điểm mạnh

    @Column(columnDefinition = "TEXT")
    String goals;                // Mục tiêu cải thiện

    LocalDate createdAt;
}