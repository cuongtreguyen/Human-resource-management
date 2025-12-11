package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KanbanChecklistRequest {
    @NotBlank(message = "Title không được để trống")
    private String title;

    private Integer position;
}
