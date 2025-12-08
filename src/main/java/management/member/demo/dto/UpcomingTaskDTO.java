package management.member.demo.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpcomingTaskDTO {
    String title;
    String employeeName; // Tên nhân viên được giao task (nếu có nhiều nhân viên thì lấy người đầu tiên)
    LocalDate deadline;
}

