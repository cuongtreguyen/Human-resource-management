package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @NotBlank
    @Size(max = 255)
    @Column(name = "title", nullable = false)
    String title;
    @Size(max = 5000)
    @Column(name = "description", columnDefinition = "TEXT")
    String description;
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "task_priority_status", nullable = false)
    TaskPriorityStatus taskPriorityStatus;
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "task_status", nullable = false)
    TaskStatus taskStatus;
    @NotNull
    @Column(name = "created_at", nullable = false)
    LocalDate createdAt;
    @Column(name = "updated_at")
    LocalDate updatedAt;
    @Column(name = "deadline")
    LocalDate deadline;
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    TaskTag tag;

    @ManyToOne(fetch = FetchType.LAZY) // Lazy để khi load Task không nhất thiết phải load hết thông tin Board ngay
    @JoinColumn(name = "board_id")
    Board board;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Comment> comments;

    /** Quan hệ One-to-Many với OverTime: 1 task có thể có nhiều yêu cầu OT */
    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY)
    List<OverTime> overTimes;
}