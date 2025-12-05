package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import management.member.demo.dto.EmployeeEvaluationSummaryDTO;
import management.member.demo.dto.EvaluationRequest;
import management.member.demo.dto.EvaluationResponse;
import management.member.demo.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    @Autowired
    EvaluationService evaluationService;

    /**
     * API Tổng hợp cho Dashboard Đánh giá.
     * Đáp ứng:
     * - Tìm theo tên
     * - Tìm theo phòng ban
     * - Lấy tất cả theo phòng
     * * Usage:
     * - GET /api/evaluations?keyword=Hai                 (Tìm tên)
     * - GET /api/evaluations?department=IT               (Lọc phòng ban)
     * - GET /api/evaluations?keyword=Hai&department=IT   (Kết hợp)
     * - GET /api/evaluations                             (Lấy tất cả)
     */
    @GetMapping
    @Operation(summary = "Lấy danh sách đánh giá nhân viên với tùy chọn tìm kiếm", description = "Get employee evaluations with optional search by keyword and department")
    @ApiResponses({
            @ApiResponse(responseCode = "200" , description="Evaluations retrieved successfully"),
            @ApiResponse(responseCode = "404", description="Employee not found")
    })
    public ResponseEntity<List<EmployeeEvaluationSummaryDTO>> getEvaluations(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String department
    ) {
        return ResponseEntity.ok(evaluationService.getEmployeeEvaluationSummaries(keyword, department));
    }

    // API Tạo đánh giá
    @PostMapping
    @Operation(summary = "Tạo đánh giá", description = "Create a new evaluation")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Evaluation created successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EvaluationResponse> createEvaluation(@RequestBody @Valid EvaluationRequest request) {
        return ResponseEntity.ok(evaluationService.createEvaluation(request));
    }

    // API Xem chi tiết đánh giá
    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đánh giá theo ID", description = "Get evaluation details by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Evaluation details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Evaluation not found")
    })
    public ResponseEntity<EvaluationResponse> getEvaluationDetail(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.getEvaluationDetail(id));
    }
}