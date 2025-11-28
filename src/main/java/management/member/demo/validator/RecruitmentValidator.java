package management.member.demo.validator;

import management.member.demo.dto.CreatePositionRequestDTO;
import management.member.demo.dto.UpdateApplicationStatusRequestDTO;
import management.member.demo.exception.model.ErrorCode;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Validator class - Chỉ chịu trách nhiệm validate Recruitment data
 * Không chứa business logic hay logic lưu trữ
 */
@Component
public class RecruitmentValidator {

    /**
     * Validate CreatePositionRequestDTO
     */
    public void validateCreatePositionRequest(CreatePositionRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate title
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Tiêu đề vị trí không được để trống");
        }

        // Validate department
        if (request.getDepartment() == null || request.getDepartment().trim().isEmpty()) {
            throw ErrorCode.INVALID_DEPARTMENT.toException();
        }

        // Validate location
        if (request.getLocation() == null || request.getLocation().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Địa điểm làm việc không được để trống");
        }

        // Validate type
        if (request.getType() == null || request.getType().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Loại vị trí không được để trống");
        }

        // Validate level
        if (request.getLevel() == null || request.getLevel().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Cấp độ vị trí không được để trống");
        }

        // Validate salary
        if (request.getSalary() == null || request.getSalary().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Mức lương không được để trống");
        }

        // Validate experience
        if (request.getExperience() == null || request.getExperience().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Kinh nghiệm không được để trống");
        }

        // Validate openings
        if (request.getOpenings() == null || request.getOpenings() <= 0) {
            throw ErrorCode.INVALID_REQUEST.toException("Số lượng tuyển dụng phải lớn hơn 0");
        }

        // Validate closingDate
        if (request.getClosingDate() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Ngày đóng đơn không được để trống");
        }

        // Validate closingDate not in the past
        if (request.getClosingDate().isBefore(LocalDate.now())) {
            throw ErrorCode.INVALID_REQUEST.toException("Ngày đóng đơn không được trong quá khứ");
        }
    }

    /**
     * Validate UpdateApplicationStatusRequestDTO
     */
    public void validateUpdateApplicationStatusRequest(UpdateApplicationStatusRequestDTO request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException();
        }

        // Validate status
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            throw ErrorCode.INVALID_STATUS.toException();
        }
    }

    /**
     * Validate position ID string
     */
    public void validatePositionIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("ID vị trí không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_REQUEST.toException("ID vị trí không hợp lệ: " + id);
        }
    }

    /**
     * Validate application ID string
     */
    public void validateApplicationIdString(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("ID đơn ứng tuyển không được để trống");
        }
        try {
            Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            throw ErrorCode.INVALID_REQUEST.toException("ID đơn ứng tuyển không hợp lệ: " + id);
        }
    }
}

