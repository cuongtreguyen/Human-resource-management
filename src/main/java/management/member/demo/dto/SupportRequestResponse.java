package management.member.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SupportRequestResponse {
    Long id;
    String title;
    String content;
    String category;        // Enum name
    String status;          // Enum name

    // Thông tin người gửi
    Long requesterId;
    String requesterName;
    String requesterDepartment;
    String requesterAvatar;

    // Phản hồi
    String managerResponse;
    String adminResponse;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}