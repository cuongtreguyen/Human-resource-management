package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.Service.PolicyService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policies")
@Tag(name = "Policies", description = "Policy management endpoints")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    @GetMapping
    @Operation(summary = "Get all policies", description = "Get list of all policies")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<PolicyListResponseDTO> getAllPolicies() {
        PolicyListResponseDTO response = policyService.getAllPolicies();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create policy", description = "Create a new policy")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Policy created successfully")
    })
    public ResponseEntity<CreatePolicyResponseDTO> createPolicy(
            @Valid @RequestBody CreatePolicyRequestDTO request) {
        CreatePolicyResponseDTO response = policyService.createPolicy(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

