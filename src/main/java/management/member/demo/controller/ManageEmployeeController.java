package management.member.demo.controller;

import jakarta.validation.Valid;
import management.member.demo.Service.ManageEmployeeService;
import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class ManageEmployeeController {

	private final ManageEmployeeService service;

	@Autowired
	public ManageEmployeeController(ManageEmployeeService service) {
		this.service = service;
	}

    @GetMapping
    @Operation(summary = "List employees", description = "Get all employees")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<List<EmployeeResponse>> list() {
		return ResponseEntity.ok(service.informationEmployee());
	}

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by id", description = "Get one employee by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeeResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findEmployeeById(id));
	}

    @PostMapping
    @Operation(summary = "Create employee", description = "Create a new employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Created"),
            @ApiResponse(responseCode = "409", description = "EMPLOYEE_EMAIL_EXISTS/EMPLOYEE_CODE_EXISTS")
    })
    public ResponseEntity<EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
		return ResponseEntity.ok(service.create(request));
	}
}


