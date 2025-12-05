package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.dto.AllBenefitResponseDTO;
import management.member.demo.dto.CreateBenefitRequestDTO;
import management.member.demo.dto.UpdateBenefitRequestDTO;
import management.member.demo.service.BenefitsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/benefits")
@Tag(name = "Benefits", description = "Benefits (template) management endpoints")
public class BenefitsController {

    private final BenefitsService benefitsService;

    @Autowired
    public BenefitsController(BenefitsService benefitsService) {
        this.benefitsService = benefitsService;
    }

    @GetMapping("/all")
    @Operation(
            summary = "Get all benefits",
            description = "Lấy tất cả danh sách phúc lợi template với benefitName, allowance_amount, department, numberOfEmployees, status, totalCost"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "No benefits found")
    })
    public ResponseEntity<List<AllBenefitResponseDTO>> getAllBenefits() {
        List<AllBenefitResponseDTO> result = benefitsService.getAllBenefits();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/create")
    @Operation(
            summary = "Create new benefit",
            description = "Tạo phúc lợi template mới với benefitId, benefitName, description, numberOfEmployees, coverage, allowanceAmount (BigDecimal), status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Benefit created successfully")
    })
    public ResponseEntity<AllBenefitResponseDTO> createBenefit(
            @Valid @RequestBody CreateBenefitRequestDTO request) {
        AllBenefitResponseDTO result = benefitsService.createBenefit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{benefitId}")
    @Operation(
            summary = "Update benefit by benefit ID",
            description = "Cập nhật phúc lợi template theo benefitId với benefitName, description, numberOfEmployees, coverage, allowanceAmount (BigDecimal), status"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Benefit updated successfully"),
            @ApiResponse(responseCode = "404", description = "Benefit not found")
    })
    public ResponseEntity<AllBenefitResponseDTO> updateBenefit(
            @PathVariable String benefitId,
            @Valid @RequestBody UpdateBenefitRequestDTO request) {
        AllBenefitResponseDTO result = benefitsService.updateBenefit(benefitId, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{benefitId}")
    @Operation(
            summary = "Delete benefit by benefit ID",
            description = "Xóa phúc lợi template theo benefitId"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Benefit deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Benefit not found")
    })
    public ResponseEntity<Void> deleteBenefit(@PathVariable String benefitId) {
        benefitsService.deleteBenefit(benefitId);
        return ResponseEntity.ok().build();
    }
}
