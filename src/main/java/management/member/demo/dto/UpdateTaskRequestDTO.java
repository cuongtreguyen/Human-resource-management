package management.member.demo.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTaskRequestDTO {
    String title;
    String description;
    String status;          // "IN-PROGRESS", "DONE"...
    String priority;        // "HIGH", "MEDIUM"...
    LocalDate deadline;     // Ngày hết hạn
    String tag;             // Nhãn
    List<Long> assigneeIds; // Danh sách ID thành viên ("Thêm thành viên")
}