package management.member.demo.validator;

import management.member.demo.dto.OvertimeRequest;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Validator class - Chỉ chịu trách nhiệm validate Overtime data
 * Không chứa business logic hay logic lưu trữ
 */
@Component
public class OvertimeValidator {

    /**
     * Validate OvertimeRequest for create operation
     */
    public void validateCreateOvertimeRequest(OvertimeRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate otDate
        if (request.getOtDate() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Ngày làm thêm giờ không được để trống");
        }

        // Validate otHours
        if (request.getOtHours() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Số giờ làm thêm không được để trống");
        }
        validateOtHours(request.getOtHours());

        // Validate reason (required)
        if (request.getReason() == null || request.getReason().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Lý do làm thêm giờ không được để trống");
        }
        if (request.getReason().length() > 1000) {
            throw ErrorCode.INVALID_REQUEST.toException("Lý do làm thêm giờ không được vượt quá 1000 ký tự");
        }

        // Validate department (required)
        if (request.getDepartment() == null || request.getDepartment().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Phòng ban không được để trống");
        }
        if (request.getDepartment().length() > 100) {
            throw ErrorCode.INVALID_REQUEST.toException("Phòng ban không được vượt quá 100 ký tự");
        }
    }

    /**
     * Validate otHours - phải từ 0 đến 24
     */
    public void validateOtHours(Double otHours) {
        if (otHours == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Số giờ làm thêm không được để trống");
        }
        if (otHours < 0) {
            throw ErrorCode.INVALID_REQUEST.toException("Số giờ làm thêm phải lớn hơn hoặc bằng 0");
        }
        if (otHours > 24) {
            throw ErrorCode.INVALID_REQUEST.toException("Số giờ làm thêm không được vượt quá 24 giờ");
        }
    }

    /**
     * Validate otDate - không được trong quá khứ (trừ hôm nay)
     */
    public void validateOtDate(LocalDate otDate) {
        if (otDate == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Ngày làm thêm giờ không được để trống");
        }
        if (otDate.isBefore(LocalDate.now())) {
            throw ErrorCode.INVALID_REQUEST.toException("Ngày làm thêm giờ không được trong quá khứ");
        }
    }

    /**
     * Validate thời gian đăng ký OT (chỉ được đăng ký trong khoảng 14:00 - 17:00 của ngày hôm nay)
     */
    public void validateOvertimeRegistrationTime(LocalDate otDate) {
        if (otDate == null) {
            return; // validateOtDate sẽ xử lý
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (otDate.equals(today)) {
            // Giới hạn giờ: trước 14h hoặc sau 17h không được đăng ký
            if (now.isBefore(LocalTime.of(14, 0)) || now.isAfter(LocalTime.of(17, 0))) {
                throw ErrorCode.OVERTIME_OUT_OF_TIME.toException();
            }
        }
    }
}
