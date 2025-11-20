package management.member.demo.controller;

import management.member.demo.Service.EmployeeBenefitsService;
import management.member.demo.dto.EmployeeBenefitsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee-benefits")
@Tag(name = "Employee Benefits", description = "Employee benefits management endpoints")
public class EmployeeBenefitsController {

    private final EmployeeBenefitsService employeeBenefitsService;

    @Autowired
    public EmployeeBenefitsController(EmployeeBenefitsService employeeBenefitsService) {
        this.employeeBenefitsService = employeeBenefitsService;
    }

    // Lấy tất cả danh sách phúc lợi nhân viên
    @GetMapping
    @Operation(
            summary = "Get all employee benefits",
            description = "Lấy tất cả danh sách phúc lợi nhân viên"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "No employee benefits found")
    })
    public ResponseEntity<List<EmployeeBenefitsResponse>> getAllEmployeeBenefits() {
        return ResponseEntity.ok(employeeBenefitsService.GetAllEmployeeBenefits());
    }

    // Đếm tổng số lượng phúc lợi của nhân viên theo ID
    @GetMapping("/{employeeId}/total")
    @Operation(
            summary = "Get total benefits count by employee ID",
            description = "Đếm tổng số lượng phúc lợi của nhân viên theo ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found"),
            @ApiResponse(responseCode = "400", description = "Invalid employee ID")
    })
    public ResponseEntity<Map<String, Object>> getTotalBenefits(@PathVariable Long employeeId) {
        Long total = employeeBenefitsService.getTotalBenefits(employeeId);
        return ResponseEntity.ok(Map.of(
                "employeeId", employeeId,
                "totalBenefits", total
        ));
    }
}

