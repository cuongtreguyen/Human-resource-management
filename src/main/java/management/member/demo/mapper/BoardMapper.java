package management.member.demo.mapper;

import management.member.demo.dto.BoardResponse;
import management.member.demo.entity.Board;
import management.member.demo.entity.Task;
import management.member.demo.enums.TaskStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BoardMapper {

    public BoardResponse toResponse(Board board) {
        List<Task> tasks = board.getTasks();
        int total = tasks != null ? tasks.size() : 0;

        // Đếm số lượng task theo trạng thái
        long todo = countStatus(tasks, TaskStatus.NEW); // Hoặc PENDING tùy enum của bạn
        long inProgress = countStatus(tasks, TaskStatus.IN_PROGRESS);
        long review = countStatus(tasks, TaskStatus.REVIEW); // Giả sử Pending là Review, bạn chỉnh lại cho đúng Enum nhé
        long done = countStatus(tasks, TaskStatus.COMPLETED);

        // Tính phần trăm tiến độ
        double progress = total > 0 ? ((double) done / total) * 100 : 0;

        return BoardResponse.builder()
                .id(board.getId())
                .name(board.getName())
                .description(board.getDescription())
                .createdAt(board.getCreatedAt())
                .memberCount(board.getMembers() != null ? board.getMembers().size() : 0)
                .totalTasks(total)
                .progress(Math.round(progress * 10.0) / 10.0) // Làm tròn 1 chữ số thập phân
                .todoCount(todo)
                .inProgressCount(inProgress)
                .reviewCount(review)
                .doneCount(done)
                .build();
    }

    private long countStatus(List<Task> tasks, TaskStatus status) {
        if (tasks == null) return 0;
        return tasks.stream().filter(t -> t.getTaskStatus() == status).count();
    }
}