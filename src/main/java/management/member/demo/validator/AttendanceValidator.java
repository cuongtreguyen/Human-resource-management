package management.member.demo.validator;

import management.member.demo.dto.AttendanceRequest;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class AttendanceValidator {

    public void validateEmployeeId(Long employeeId) {
        if (employeeId == null) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException("ID nhân viên không được để trống");
        }
    }

    public void validateEmployeeIdString(String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException("ID nhân viên không được để trống");
        }
        try {
            Long.parseLong(employeeId.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_EMPLOYEE_ID.toException("ID nhân viên không hợp lệ: " + employeeId);
        }
    }

    public void validateAttendanceIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_ATTENDANCE_ID.toException("ID chấm công không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_ATTENDANCE_ID.toException("ID chấm công không hợp lệ: " + id);
        }
    }

    public void validateDateString(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            throw ErrorCode.INVALID_DATE_FORMAT.toException("Ngày không được để trống");
        }
        try {
            LocalDate.parse(dateStr.trim());
        } catch (Exception e) {
            throw ErrorCode.INVALID_DATE_FORMAT.toException("Định dạng ngày không hợp lệ: " + dateStr + ". Định dạng yêu cầu: yyyy-MM-dd");
        }
    }

    public LocalDate validateDateStringOptional(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        validateDateString(dateStr);
        return LocalDate.parse(dateStr.trim());
    }

    public void validateAttendanceRequest(AttendanceRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }
        validateEmployeeIdString(request.getEmployeeId());
        if (request.getAttendanceDate() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Ngày chấm công không được để trống");
        }
        // checkIn và checkOut are optional
    }
}

