package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.BoardStatus;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "board")
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Getter
@Setter
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    @Column(name = "name", nullable = false)
    String name; // Ví dụ: "Dự án Website Công ty"

    @Column(name = "created_at", nullable = false)
    LocalDate createdAt;

    // Quan hệ 1 Board - Nhiều Task
    // mappedBy = "board" nghĩa là bên class Task sẽ có field tên là "board" quản lý quan hệ này
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Task> tasks;

    // Quan hệ Board - Member (Thành viên thuộc dự án này)
    // Để hiển thị số "3 thành viên" như trong ảnh
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "board_members",
            joinColumns = @JoinColumn(name = "board_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    List<Employee> members;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    BoardStatus status = BoardStatus.ACTIVE;

    // Quan hệ Board - Labels (Nhãn của board)
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    List<KanbanLabel> labels;

    // Quan hệ Board - Lists (Danh sách Kanban của board)
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    List<KanbanList> lists;
}