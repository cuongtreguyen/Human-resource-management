package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import management.member.demo.Service.ProfileService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "Profile & Settings", description = "Profile and settings management endpoints")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/employees/{employeeId}/performance")
    @Operation(summary = "Get employee performance", description = "Get performance information for an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeePerformanceDTO> getEmployeePerformance(@PathVariable String employeeId) {
        EmployeePerformanceDTO response = profileService.getEmployeePerformance(employeeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employees/{employeeId}/training")
    @Operation(summary = "Get employee training", description = "Get training information for an employee")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<EmployeeTrainingResponseDTO> getEmployeeTraining(@PathVariable String employeeId) {
        EmployeeTrainingResponseDTO response = profileService.getEmployeeTraining(employeeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    @Operation(summary = "Get profile", description = "Get current user profile")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<ProfileDTO> getProfile(@RequestParam(required = false) String userId) {
        // TODO: Get userId from security context
        String currentUserId = userId != null ? userId : "1"; // Default for now
        ProfileDTO response = profileService.getProfile(currentUserId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update profile", description = "Update current user profile")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UpdateProfileResponseDTO> updateProfile(
            @RequestParam(required = false) String userId,
            @Valid @RequestBody UpdateProfileRequestDTO request) {
        String currentUserId = userId != null ? userId : "1"; // Default for now
        UpdateProfileResponseDTO response = profileService.updateProfile(currentUserId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/settings")
    @Operation(summary = "Get settings", description = "Get system settings")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<SettingsResponseDTO> getSettings() {
        SettingsResponseDTO response = profileService.getSettings();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/settings")
    @Operation(summary = "Update settings", description = "Update system settings")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Settings updated successfully")
    })
    public ResponseEntity<UpdateSettingsResponseDTO> updateSettings(
            @Valid @RequestBody UpdateSettingsRequestDTO request) {
        UpdateSettingsResponseDTO response = profileService.updateSettings(request);
        return ResponseEntity.ok(response);
    }
}

