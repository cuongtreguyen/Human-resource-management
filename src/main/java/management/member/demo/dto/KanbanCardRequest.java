package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class KanbanCardRequest {
    @NotBlank(message = "Card title is required")
    @Size(max = 255, message = "Card title must be less than 255 characters")
    private String title;
}
