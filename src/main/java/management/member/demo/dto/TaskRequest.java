package management.member.demo.dto;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.Enum.TaskPriorityStatus;
import management.member.demo.Enum.TaskStatus;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TaskRequest {
    Long employeeId;
    String title;
    String description;
    @Enumerated(EnumType.STRING)
    TaskPriorityStatus taskPriorityStatus;
    @Enumerated(EnumType.STRING)
    TaskStatus taskStatus;
    LocalDate createdAt;
}
