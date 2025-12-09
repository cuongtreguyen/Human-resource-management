package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CommentUpdateRequest {
    @NotBlank(message = "Nội dung comment không được để trống")
    String content;
}

