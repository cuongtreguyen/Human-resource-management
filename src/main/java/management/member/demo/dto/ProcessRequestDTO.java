package management.member.demo.dto;

import lombok.Data;

@Data
public class ProcessRequestDTO {
    String status;          // Trạng thái mới (COMPLETED, ESCALATED_TO_ADMIN, ...)
    String managerResponse; // Nội dung phản hồi của Manager
}