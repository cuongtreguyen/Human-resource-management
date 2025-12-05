package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBoardStatusRequest {
    @NotBlank(message = "Trạng thái không được để trống")
    String status; // Frontend sẽ gửi: "ARCHIVED", "ACTIVE", ...
}