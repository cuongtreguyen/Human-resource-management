package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import management.member.demo.Service.NotificationService;
import management.member.demo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Notifications management endpoints")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get notifications", description = "Get notifications with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<NotificationListResponseDTO> getNotifications(
            @RequestParam(required = false) Boolean read,
            @RequestParam(required = false) String type) {
        NotificationListResponseDTO response = notificationService.getNotifications(read, type);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark notification as read", description = "Mark a specific notification as read")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    public ResponseEntity<MarkNotificationReadResponseDTO> markAsRead(@PathVariable String id) {
        MarkNotificationReadResponseDTO response = notificationService.markAsRead(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read", description = "Mark all notifications as read")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<MarkAllReadResponseDTO> markAllAsRead() {
        MarkAllReadResponseDTO response = notificationService.markAllAsRead();
        return ResponseEntity.ok(response);
    }
}

