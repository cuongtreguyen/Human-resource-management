package management.member.demo.mapper;

import management.member.demo.dto.OvertimeDetailResponse;
import management.member.demo.dto.OvertimeListResponse;
import management.member.demo.dto.OvertimeRequest;
import management.member.demo.dto.OvertimeResponse;
import management.member.demo.entity.OverTime;
import management.member.demo.enums.OverTimeStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO
 */
@Component
public class OverTimeMapper {

    /**
     * Map Overtime entity sang OvertimeResponse DTO
     * Bao gồm cả việc lấy thông tin Task nếu có
     */
    // Hàm 1: Dùng cho Create (Chỉ trả về thông tin cơ bản, ẩn người duyệt)
    public OvertimeResponse toCreateResponse(OverTime overtime) {
        return OvertimeResponse.builder()
                .id(overtime.getId())
                .employeeId(overtime.getEmployee() != null ? overtime.getEmployee().getId().toString() : null)
                .otDate(overtime.getOtDate())
                .otHours(overtime.getOtHours())
                .reason(overtime.getReason())
                .taskId(overtime.getTask() != null ? overtime.getTask().getId() : null)
                .overtimeStatus(overtime.getOvertimeStatus())
                .createdAt(overtime.getCreatedAt()) // Đã fix: Map trường này để không bị null
                // Không map approvedBy và managerNote (để mặc định null)
                .department(overtime.getDepartment())
                .build();
    }

    // Hàm 2: Dùng cho Set Status (Trả về đầy đủ thông tin người duyệt)
    public OvertimeResponse toStatusResponse(OverTime overtime) {
        String approverName = null;
        if (overtime.getApprovedBy() != null) {
            // Giả sử Employee có hàm getFullName() hoặc getEmail()
            approverName = overtime.getApprovedBy().getEmail(); // Hoặc .getFullName() tùy bạn
        }

        return OvertimeResponse.builder()
                .id(overtime.getId())
                .employeeId(overtime.getEmployee() != null ? overtime.getEmployee().getId().toString() : null)
                .otDate(overtime.getOtDate())
                .otHours(overtime.getOtHours())
                .reason(overtime.getReason())
                .taskId(overtime.getTask() != null ? overtime.getTask().getId() : null)
                .overtimeStatus(overtime.getOvertimeStatus())
                .createdAt(overtime.getCreatedAt())
                .managerNote(overtime.getManagerNote())
                .approvedBy(approverName) // Đã fix: Lấy String tên/email thay vì object
                .department(overtime.getDepartment())
                .build();
    }

    public OvertimeListResponse toListResponse(OverTime overtime) {
        return OvertimeListResponse.builder()
                .id(overtime.getId())
                .employeeName(overtime.getEmployee() != null ? overtime.getEmployee().getFullName() : null)
                .department(overtime.getDepartment())
                .title(overtime.getTask() != null ? overtime.getTask().getTitle() : null)
                .deadline(overtime.getTask() != null ? overtime.getTask().getDeadline() : null)
                .otHours(overtime.getOtHours())
                .otDate(overtime.getOtDate())
                .overtimeStatus(overtime.getOvertimeStatus())
                .createdAt(overtime.getCreatedAt())
                .department(overtime.getDepartment())
                .build();
    }

    /**
     * Map OvertimeRequest DTO sang Overtime entity (chỉ mapping dữ liệu cơ bản)
     * LƯU Ý: Việc set Task (Entity) sẽ được thực hiện ở Service vì cần tìm Task từ DB theo taskId
     */
    public void updateOvertimeFromRequest(OverTime overtime, OvertimeRequest request) {
        overtime.setOtDate(request.getOtDate());
        overtime.setOtHours(request.getOtHours());
        overtime.setReason(request.getReason());
        // Không map taskId ở đây vì Overtime entity cần object Task, không phải Long taskId.
        // Service sẽ xử lý việc: overtime.setTask(foundTask);
    }

    /**
     * Tạo Overtime entity mới từ OvertimeRequest DTO
     */
    public OverTime toEntity(OvertimeRequest request) {
        OverTime overtime = new OverTime();
        updateOvertimeFromRequest(overtime, request);
        return overtime;
    }

    public OvertimeDetailResponse toDetailResponse(OverTime overtime) {
        return OvertimeDetailResponse.builder()
                .id(overtime.getId())
                .employeeName(overtime.getEmployee() != null ? overtime.getEmployee().getFullName() : null)
                .department(overtime.getDepartment())
                .title(overtime.getTask() != null ? overtime.getTask().getTitle() : null)
                .deadline(overtime.getTask() != null ? overtime.getTask().getDeadline() : null)
                .otHours(overtime.getOtHours())
                .otDate(overtime.getOtDate())
                .reason(overtime.getReason())
                .overtimeStatus(overtime.getOvertimeStatus())
                .createdAt(overtime.getCreatedAt())
                .department(overtime.getDepartment())
                .build();
    }
}