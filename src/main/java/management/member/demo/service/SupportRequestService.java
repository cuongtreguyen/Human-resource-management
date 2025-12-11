package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.SupportRequest;
import management.member.demo.enums.SupportCategory;
import management.member.demo.enums.SupportStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.SupportRequestMapper;
import management.member.demo.repository.SupportRequestRepository;
import management.member.demo.validator.SupportRequestValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SupportRequestService {

    @Autowired
    SupportRequestRepository supportRequestRepository;

    @Autowired
    SupportRequestValidator supportRequestValidator;

    @Autowired
    SupportRequestMapper supportRequestMapper;

    // 1. API Đếm số lượng (Stats Cards)
    public SupportStatsDTO getStats() {
        long total = supportRequestRepository.count();
        long escalated = supportRequestRepository.countByStatus(SupportStatus.ESCALATED_TO_ADMIN);
        long waiting = supportRequestRepository.countByStatus(SupportStatus.WAITING_INFO);
        long completed = supportRequestRepository.countByStatus(SupportStatus.COMPLETED);

        return supportRequestMapper.toStatsDTO(total, escalated, waiting, completed);
    }

    // 2. API Tìm kiếm & Lọc (Keyword, Danh mục, Trạng thái)
    public List<SupportRequestResponse> getAllRequests(String keyword, String categoryStr, String statusStr) {
        // 1. Xử lý Category
        SupportCategory category = null;
        if (categoryStr != null && !categoryStr.isEmpty()) {
            try {
                category = SupportCategory.valueOf(categoryStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Log error hoặc bỏ qua tùy nghiệp vụ
            }
        }

        // 2. Xử lý Status
        SupportStatus status = null;
        if (statusStr != null && !statusStr.isEmpty()) {
            try {
                status = SupportStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Log error hoặc bỏ qua
            }
        }

        // 3. Xử lý Keyword & Pattern (LOGIC FIX LỖI Ở ĐÂY)
        String searchPattern = null;
        if (keyword != null && !keyword.trim().isEmpty()) {
            // Chuẩn hóa keyword: cắt khoảng trắng thừa
            String trimmedKeyword = keyword.trim();
            // Tạo pattern: %keyword_thường%
            searchPattern = "%" + trimmedKeyword.toLowerCase() + "%";
        } else {
            // Nếu keyword rỗng hoặc chỉ toàn dấu cách, gán null để Query bỏ qua điều kiện tìm kiếm
            keyword = null;
        }

        // 4. Gọi Repository với tham số mới
        List<SupportRequest> requests = supportRequestRepository.searchRequests(keyword, searchPattern, category, status);

        // 5. Map sang Response
        return requests.stream()
                .map(supportRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    // 3. API Xem chi tiết
    public SupportRequestResponse getRequestDetail(Long id) {
        supportRequestValidator.validateSupportRequestId(id);
        
        SupportRequest req = supportRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SUPPORT_REQUEST_NOT_FOUND.getMessage()));
        return supportRequestMapper.toResponse(req);
    }

    // 4. API Manager xử lý (Chuyển trạng thái + Ghi phản hồi)
    public SupportRequestResponse processRequest(Long id, ProcessRequestDTO requestDTO) {
        supportRequestValidator.validateProcessRequest(id, requestDTO);
        
        SupportRequest req = supportRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SUPPORT_REQUEST_NOT_FOUND.getMessage()));

        // Cập nhật trạng thái
        if (requestDTO.getStatus() != null) {
            try {
                req.setStatus(SupportStatus.valueOf(requestDTO.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResourceNotFoundException(ErrorCode.INVALID_SUPPORT_STATUS.getMessage());
            }
        }

        // Cập nhật phản hồi của Manager
        if (requestDTO.getManagerResponse() != null) {
            req.setManagerResponse(requestDTO.getManagerResponse());
        }

        req.setUpdatedAt(LocalDateTime.now());
        return supportRequestMapper.toResponse(supportRequestRepository.save(req));
    }

}