package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.TaskPriorityStatus;
import management.member.demo.enums.TaskStatus;
import management.member.demo.enums.TaskTag;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToMany
    @JoinTable(
            name = "task_assignments", // Tên bảng trung gian sẽ được tạo trong DB
            joinColumns = @JoinColumn(name = "task_id"), // Khóa ngoại trỏ về Task
            inverseJoinColumns = @JoinColumn(name = "employee_id") // Khóa ngoại trỏ về Employee
    )
    List<Employee> employees;

    String title;
    String description;
    @Enumerated(EnumType.STRING)
    TaskPriorityStatus taskPriorityStatus;
    @Enumerated(EnumType.STRING)
    TaskStatus taskStatus;
    LocalDate createdAt;
    LocalDate updatedAt;
    LocalDate deadline;
    @Enumerated(EnumType.STRING)
    TaskTag tag;

    @ManyToOne(fetch = FetchType.LAZY) // Lazy để khi load Task không nhất thiết phải load hết thông tin Board ngay
    @JoinColumn(name = "board_id")
    Board board;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Comment> comments;
}