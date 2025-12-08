package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import management.member.demo.service.DashboardService;
import management.member.demo.dto.DashboardStatsResponseDTO;
import management.member.demo.dto.StatisticsSummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Dashboard statistics endpoints")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics", description = "Get overall dashboard statistics")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<DashboardStatsResponseDTO> getDashboardStats() {
        DashboardStatsResponseDTO stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/statistics-summary-for-manager")
    @Operation(
            summary = "Get statistics summary",
            description = "Lấy tất cả thống kê tổng hợp: tổng số nhân viên, nhân viên hiện tại, đơn nghỉ phép pending, công việc đang thực hiện, task quá hạn, đơn OT chờ xử lý, nhân viên đang nghỉ phép hôm nay, nhân viên vắng mặt hôm nay"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<StatisticsSummaryDTO> getStatisticsSummary() {
        StatisticsSummaryDTO summary = dashboardService.getStatisticsSummary();
        return ResponseEntity.ok(summary);
    }
}

