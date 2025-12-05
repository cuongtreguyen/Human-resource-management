package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import management.member.demo.dto.ProcessRequestDTO;
import management.member.demo.dto.SupportRequestResponse;
import management.member.demo.dto.SupportStatsDTO;
import management.member.demo.service.SupportRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support-requests")
public class SupportRequestController {

    @Autowired
    SupportRequestService supportRequestService;

    // 1. API Stats: Đếm số lượng cho các thẻ thống kê
    @GetMapping("/stats")
    @Operation(summary = "Get request statistics")
    public ResponseEntity<SupportStatsDTO> getStats() {
        return ResponseEntity.ok(supportRequestService.getStats());
    }

    // 2. API Tổng hợp: Tìm kiếm theo keyword, category, status
    // GET /api/support-requests?keyword=luong&category=SALARY_BONUS&status=PENDING
    @GetMapping
    @Operation(summary = "Search requests with filters")
    public ResponseEntity<List<SupportRequestResponse>> getAllRequests(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(supportRequestService.getAllRequests(keyword, category, status));
    }

    // 3. API Xem chi tiết đơn
    @GetMapping("/{id}")
    @Operation(summary = "Get request detail")
    public ResponseEntity<SupportRequestResponse> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(supportRequestService.getRequestDetail(id));
    }

    // 4. API Manager xử lý đơn (Chỉnh trạng thái + Phản hồi)
    // Body: { "status": "COMPLETED", "managerResponse": "Đã giải quyết xong." }
    // Hoặc: { "status": "ESCALATED_TO_ADMIN", "managerResponse": "Vấn đề này cần Admin can thiệp." }
    @PutMapping("/{id}/process")
    @Operation(summary = "Process a request (Update status/response)")
    public ResponseEntity<SupportRequestResponse> processRequest(
            @PathVariable Long id,
            @RequestBody ProcessRequestDTO requestDTO) {
        return ResponseEntity.ok(supportRequestService.processRequest(id, requestDTO));
    }
}