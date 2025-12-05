package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.BoardStatus;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Getter
@Setter
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name; // Ví dụ: "Dự án Website Công ty"
    String description;

    LocalDate createdAt;

    // Quan hệ 1 Board - Nhiều Task
    // mappedBy = "board" nghĩa là bên class Task sẽ có field tên là "board" quản lý quan hệ này
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Task> tasks;

    // Quan hệ Board - Member (Thành viên thuộc dự án này)
    // Để hiển thị số "3 thành viên" như trong ảnh
    @ManyToMany
    @JoinTable(
            name = "board_members",
            joinColumns = @JoinColumn(name = "board_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    List<Employee> members;

    @Enumerated(EnumType.STRING)
    BoardStatus status = BoardStatus.ACTIVE;
}