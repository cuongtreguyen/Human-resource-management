package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import management.member.demo.service.DepartmentService;
import management.member.demo.dto.DepartmentListResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
@Tag(name = "Department Management", description = "Department management endpoints")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "Get all departments", description = "Get list of all departments")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<DepartmentListResponseDTO> getAllDepartments() {
        DepartmentListResponseDTO response = departmentService.getAllDepartments();
        return ResponseEntity.ok(response);
    }
}

