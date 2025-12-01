package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import management.member.demo.service.DashboardService;
import management.member.demo.dto.DashboardStatsResponseDTO;
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
}

