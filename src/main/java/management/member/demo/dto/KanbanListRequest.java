package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class KanbanListRequest {
    @NotBlank(message = "List name is required")
    @Size(max = 50, message = "List name must be less than 50 characters")
    private String name;
}
