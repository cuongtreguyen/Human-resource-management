package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBoardNameRequest {
    @NotBlank(message = "Tên board không được để trống")
    String name;
}

