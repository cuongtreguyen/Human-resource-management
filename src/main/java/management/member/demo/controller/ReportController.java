package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.Service.ReportService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Report generation endpoints")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/generate")
    @Operation(summary = "Generate report", description = "Generate a report with specified type and format")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Report generated successfully")
    })
    public ResponseEntity<GenerateReportResponseDTO> generateReport(
            @Valid @RequestBody GenerateReportRequestDTO request) {
        GenerateReportResponseDTO response = reportService.generateReport(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/types")
    @Operation(summary = "Get report types", description = "Get available report types and formats")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<ReportTypeListResponseDTO> getReportTypes() {
        ReportTypeListResponseDTO response = reportService.getReportTypes();
        return ResponseEntity.ok(response);
    }
}

