package management.member.demo.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KanbanLabelUpdateRequest {

    @Size(max = 50, message = "Label name must be at most 50 characters")
    private String name;

    @Size(max = 20, message = "Color must be at most 20 characters")
    private String color;
}
