package management.member.demo.normalizer;

import management.member.demo.dto.CreateLeaveRequestDTO;
import management.member.demo.normalizer.common.RequestNormalizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Normalizer cho Leave Requests
 * 
 * Nhiệm vụ: Chuyển đổi tất cả input từ FE → format chuẩn của BE
 * 
 * Lưu ý:
 * - Chỉ làm nhiệm vụ convert/transform, KHÔNG validate business rules
 * - Log rõ ràng khi có field không hợp lệ để dễ debug
 * 
 * Mapping rules:
 * - leaveType → type
 * - leaveDays → days
 * - tasks (objects) → tasks (array of task IDs)
 */
@Component
public class LeaveRequestNormalizer implements RequestNormalizer<CreateLeaveRequestDTO> {
    
    private static final Logger logger = LoggerFactory.getLogger(LeaveRequestNormalizer.class);

    /**
     * Normalize CreateLeaveRequestDTO từ FE format → BE format
     * 
     * FE có thể gửi:
     * - leaveType hoặc type
     * - leaveDays hoặc days
     * - tasks (array of objects) hoặc tasks (array of strings)
     * 
     * Lưu ý: Chỉ convert/transform, KHÔNG validate business rules
     */
    @Override
    public void normalize(CreateLeaveRequestDTO request) {
        if (request == null) {
            return;
        }

        try {
            // 1. Normalize Employee ID
            if (request.getEmployeeId() != null) {
                request.setEmployeeId(request.getEmployeeId().trim());
            }

            // 2. Normalize Type (Quan trọng: chuyển về chữ hoa để switch-case trong Service hoạt động tốt)
            if (request.getType() != null) {
                // Ví dụ: "  Annual  " -> "ANNUAL"
                request.setType(request.getType().trim().toUpperCase());
            }

            // 3. Normalize Reason
            if (request.getReason() != null) {
                request.setReason(request.getReason().trim());
            }

            // Note: Đã xóa logic xử lý 'tasks' vì field này không còn trong DTO và UI

        } catch (Exception e) {
            logger.error("Error normalizing CreateLeaveRequestDTO: {}", e.getMessage(), e);
            // Không ném lỗi để flow vẫn tiếp tục, data xấu thì Validator sẽ bắt sau
        }
    }

    /**
     * Extract task IDs từ tasks array
     * Hỗ trợ cả array of strings và array of objects
     * 
     * FE có thể gửi:
     * - ["TASK001", "TASK002"] (strings)
     * - [{"id": "TASK001"}, {"taskId": "TASK002"}] (objects)
     * 
     * Note: Nếu FE gửi objects, Jackson sẽ deserialize thành List<Map> hoặc List<Object>
     * Nhưng CreateLeaveRequestDTO có field List<String>, nên cần xử lý ở tầng khác
     * hoặc tạo FlexibleCreateLeaveRequestDTO riêng để nhận flexible input
     */
    private List<String> extractTaskIds(List<String> tasks) {
        if (tasks == null || tasks.isEmpty()) {
            return tasks;
        }

        // Nếu đã là strings, return as is
        // Note: Nếu FE gửi objects, cần tạo DTO riêng hoặc dùng @JsonDeserialize
        return tasks.stream()
                .filter(task -> task != null && !task.trim().isEmpty())
                .collect(Collectors.toList());
    }
}

