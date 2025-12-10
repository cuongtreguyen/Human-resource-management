package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardResponse {
    Long id;
    String name;
    LocalDate createdAt;

    // Danh sách thành viên của board
    List<EmployeeResponse> members;

    // Danh sách labels của board
    List<KanbanLabelResponse> labels;

    // Danh sách lists (columns) của board - chứa cards
    List<KanbanListResponse> lists;

    // Các field thống kê hiển thị trên thẻ Board
    int memberCount;    // "3 thành viên"
    double progress;    // "Tiến độ 25%"

    // Thống kê nhỏ bên dưới (Cần làm, Đang làm, Review, Xong)
    long todoCount;     // status NEW/PENDING
    long inProgressCount;
    long reviewCount;
    long doneCount;
}