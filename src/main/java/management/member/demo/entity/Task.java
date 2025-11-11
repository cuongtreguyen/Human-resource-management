package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.Enum.TaskPriorityStatus;
import management.member.demo.Enum.TaskStatus;

import java.time.LocalDate;

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

    @ManyToOne
    @JoinColumn(name = "employee_id")
    Employee employee;

    String title;
    String description;
    @Enumerated(EnumType.STRING)
    TaskPriorityStatus taskPriorityStatus;
    @Enumerated(EnumType.STRING)
    TaskStatus taskStatus;
    LocalDate createdAt;
}
