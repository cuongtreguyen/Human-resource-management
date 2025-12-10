package management.member.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMemberRequest {
    // boardId có thể null khi dùng API mới POST /api/boards/{id}/members
    // vì boardId được lấy từ path parameter
    private Long boardId;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
}