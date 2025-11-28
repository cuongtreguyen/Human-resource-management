package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateTaskRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private String priority; // "high", "medium", "low"
    
    @NotBlank(message = "Assignee ID is required")
    private String assigneeId;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private String department; // Optional
}

