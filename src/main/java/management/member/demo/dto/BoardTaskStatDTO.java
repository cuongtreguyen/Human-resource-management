package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter
@Setter
public class BoardTaskStatDTO {
    private Long boardId;
    private Long totalTasks; // Tổng số task của board này
    // Map chứa thống kê: "NEW": 5, "IN_PROGRESS": 2...
    private Map<String, Long> stats;
}