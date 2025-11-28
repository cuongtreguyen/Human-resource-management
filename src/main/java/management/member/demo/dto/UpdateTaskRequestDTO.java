package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateTaskRequestDTO {
    private String title;
    private String status; // "new", "in-progress", "pending", "complete"
    private String priority; // "high", "medium", "low"
    private Integer progress; // 0-100
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
}

