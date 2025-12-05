package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.SupportCategory;
import management.member.demo.enums.SupportStatus;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Getter
@Setter
public class SupportRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String title; // Tiêu đề (VD: Yêu cầu điều chỉnh lương)

    @Column(columnDefinition = "TEXT", nullable = false)
    String content; // Nội dung yêu cầu

    @Enumerated(EnumType.STRING)
    SupportCategory category; // Danh mục

    @Enumerated(EnumType.STRING)
    SupportStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    Employee requester; // Nhân viên gửi yêu cầu

    // Phản hồi từ các cấp
    @Column(columnDefinition = "TEXT")
    String managerResponse; // Phản hồi của Manager (bạn)

    @Column(columnDefinition = "TEXT")
    String adminResponse;   // Kết quả xử lý từ Admin (nếu có chuyển lên)

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}