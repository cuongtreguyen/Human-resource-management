package management.member.demo.Mapper;

import management.member.demo.dto.DailyAttendanceResponseDTO;
import management.member.demo.dto.FaceRecognitionResponseDTO;
import management.member.demo.entity.Attendance;
import org.springframework.stereotype.Component;

/**
 * Helper class for complex Attendance mappings that cannot be handled by MapStruct
 * Chỉ chịu trách nhiệm mapping logic phức tạp
 */
@Component
public class AttendanceMapperHelper {

    /**
     * Map Attendance entity sang DailyAttendanceResponseDTO với tính toán hoursWorked và overtime
     */
    public DailyAttendanceResponseDTO toDailyAttendanceDTO(Attendance attendance) {
        DailyAttendanceResponseDTO dto = new DailyAttendanceResponseDTO();
        dto.setId(String.valueOf(attendance.getId()));
        
        if (attendance.getEmployee() != null) {
            dto.setEmployeeId(String.valueOf(attendance.getEmployee().getId()));
            dto.setEmployeeName(attendance.getEmployee().getFullName());
        } else {
            dto.setEmployeeId(attendance.getUserId());
            dto.setEmployeeName(attendance.getFullName());
        }
        
        dto.setDate(attendance.getAttendanceDate());
        dto.setCheckIn(attendance.getCheckIn());
        dto.setCheckOut(attendance.getCheckOut());
        
        // Tính status
        if (attendance.getCheckIn() != null) {
            dto.setStatus("present");
        } else {
            dto.setStatus("absent");
        }
        
        // Tính hoursWorked và overtime
        if (attendance.getCheckIn() != null && attendance.getCheckOut() != null) {
            long minutesWorked = java.time.Duration.between(attendance.getCheckIn(), attendance.getCheckOut()).toMinutes();
            double hoursWorked = minutesWorked / 60.0;
            dto.setHoursWorked(Math.round(hoursWorked * 10.0) / 10.0);
            
            // Overtime: giả sử 8 giờ làm việc tiêu chuẩn, tính overtime nếu > 8 giờ
            double standardHours = 8.0;
            if (hoursWorked > standardHours) {
                double overtime = hoursWorked - standardHours;
                dto.setOvertime(Math.round(overtime * 10.0) / 10.0);
            } else {
                dto.setOvertime(0.0);
            }
        } else {
            dto.setHoursWorked(0.0);
            dto.setOvertime(0.0);
        }
        
        return dto;
    }

    /**
     * Tạo FaceRecognitionResponseDTO thành công
     */
    public FaceRecognitionResponseDTO toSuccessResponse(Attendance attendance, boolean isCheckIn) {
        FaceRecognitionResponseDTO response = new FaceRecognitionResponseDTO();
        response.setSuccess(true);
        response.setMessage("Attendance recorded successfully");
        response.setAttendanceId(String.valueOf(attendance.getId()));
        response.setCheckInTime(attendance.getCheckIn() != null ? attendance.getCheckIn().toString() : null);
        response.setCheckOutTime(attendance.getCheckOut() != null ? attendance.getCheckOut().toString() : null);
        response.setStatus(isCheckIn ? "checked_in" : "checked_out");
        return response;
    }

    /**
     * Tạo FaceRecognitionResponseDTO cho trường hợp đã có attendance
     */
    public FaceRecognitionResponseDTO toAlreadyRecordedResponse(Attendance attendance) {
        FaceRecognitionResponseDTO response = new FaceRecognitionResponseDTO();
        response.setSuccess(true);
        response.setMessage("Attendance already recorded for today");
        response.setAttendanceId(String.valueOf(attendance.getId()));
        response.setCheckInTime(attendance.getCheckIn().toString());
        response.setCheckOutTime(attendance.getCheckOut() != null ? attendance.getCheckOut().toString() : null);
        response.setStatus("checked_in");
        return response;
    }

    /**
     * Tạo FaceRecognitionResponseDTO lỗi với confidence thấp
     */
    public FaceRecognitionResponseDTO toLowConfidenceErrorResponse(Double confidence) {
        FaceRecognitionResponseDTO errorResponse = new FaceRecognitionResponseDTO();
        errorResponse.setSuccess(false);
        errorResponse.setMessage("Low confidence score. Please try again.");
        errorResponse.setConfidence(confidence);
        return errorResponse;
    }

    /**
     * Tạo FaceRecognitionResponseDTO lỗi với message
     */
    public FaceRecognitionResponseDTO toErrorResponse(String message) {
        FaceRecognitionResponseDTO errorResponse = new FaceRecognitionResponseDTO();
        errorResponse.setSuccess(false);
        errorResponse.setMessage(message);
        return errorResponse;
    }
}

