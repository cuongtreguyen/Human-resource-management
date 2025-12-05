package management.member.demo.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreateTaskRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;
    private Long boardId;
}