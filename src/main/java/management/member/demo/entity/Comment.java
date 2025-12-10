package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Getter
@Setter
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(columnDefinition = "TEXT")
    String content; // Nội dung bình luận ("JWT đã implement xong...")

    LocalDateTime createdAt; // Cần dùng LocalDateTime để lưu cả giờ (16:15)

    // Link ngược lại Task (optional - cho Task system)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    Task task;

    // Link ngược lại Kanban Card (optional - cho Kanban system)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id")
    KanbanCard card;

    // Lưu người bình luận (để hiện avatar/tên)
    @ManyToOne
    @JoinColumn(name = "author_id")
    Employee author;
}