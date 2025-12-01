package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.enums.TaskPriorityStatus;
import management.member.demo.enums.TaskStatus;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TaskResponse {
    Long id;
    String title;
    String description;
    TaskPriorityStatus taskPriorityStatus;
    TaskStatus taskStatus;
    LocalDate createdAt;
    LocalDate endedAt;
}
