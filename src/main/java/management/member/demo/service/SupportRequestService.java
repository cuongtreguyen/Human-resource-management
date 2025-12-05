package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.SupportRequest;
import management.member.demo.enums.SupportCategory;
import management.member.demo.enums.SupportStatus;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.SupportRequestRepository;
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

    // 1. API Đếm số lượng (Stats Cards)
    public SupportStatsDTO getStats() {
        long total = supportRequestRepository.count();
        long escalated = supportRequestRepository.countByStatus(SupportStatus.ESCALATED_TO_ADMIN);
        long waiting = supportRequestRepository.countByStatus(SupportStatus.WAITING_INFO);
        long completed = supportRequestRepository.countByStatus(SupportStatus.COMPLETED);

        return SupportStatsDTO.builder()
                .totalRequests(total)
                .escalatedToAdmin(escalated)
                .waitingInfo(waiting)
                .completed(completed)
                .build();
    }

    // 2. API Tìm kiếm & Lọc (Keyword, Danh mục, Trạng thái)
    public List<SupportRequestResponse> getAllRequests(String keyword, String categoryStr, String statusStr) {
        SupportCategory category = null;
        if (categoryStr != null && !categoryStr.isEmpty()) {
            try { category = SupportCategory.valueOf(categoryStr.toUpperCase()); } catch (Exception e) {}
        }

        SupportStatus status = null;
        if (statusStr != null && !statusStr.isEmpty()) {
            try { status = SupportStatus.valueOf(statusStr.toUpperCase()); } catch (Exception e) {}
        }

        List<SupportRequest> requests = supportRequestRepository.searchRequests(keyword, category, status);

        return requests.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // 3. API Xem chi tiết
    public SupportRequestResponse getRequestDetail(Long id) {
        SupportRequest req = supportRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yêu cầu hỗ trợ không tồn tại"));
        return toResponse(req);
    }

    // 4. API Manager xử lý (Chuyển trạng thái + Ghi phản hồi)
    public SupportRequestResponse processRequest(Long id, ProcessRequestDTO requestDTO) {
        SupportRequest req = supportRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yêu cầu hỗ trợ không tồn tại"));

        // Cập nhật trạng thái
        if (requestDTO.getStatus() != null) {
            try {
                req.setStatus(SupportStatus.valueOf(requestDTO.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Trạng thái không hợp lệ");
            }
        }

        // Cập nhật phản hồi của Manager
        if (requestDTO.getManagerResponse() != null) {
            req.setManagerResponse(requestDTO.getManagerResponse());
        }

        req.setUpdatedAt(LocalDateTime.now());
        return toResponse(supportRequestRepository.save(req));
    }

    // Mapper Helper
    private SupportRequestResponse toResponse(SupportRequest req) {
        return SupportRequestResponse.builder()
                .id(req.getId())
                .title(req.getTitle())
                .content(req.getContent())
                .category(req.getCategory().name())
                .status(req.getStatus().name())
                .requesterId(req.getRequester().getId())
                .requesterName(req.getRequester().getFullName())
                .requesterDepartment(req.getRequester().getDepartment())
                // .requesterAvatar(req.getRequester().getAvatar())
                .managerResponse(req.getManagerResponse())
                .adminResponse(req.getAdminResponse())
                .createdAt(req.getCreatedAt())
                .updatedAt(req.getUpdatedAt())
                .build();
    }
}