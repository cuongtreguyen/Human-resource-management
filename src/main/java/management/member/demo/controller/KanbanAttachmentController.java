package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.KanbanAttachmentResponse;
import management.member.demo.service.KanbanAttachmentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Kanban Attachment", description = "Attachment management for Kanban cards")
public class KanbanAttachmentController {

    private final KanbanAttachmentService attachmentService;

    @GetMapping("/cards/{cardId}/attachments")
    @Operation(summary = "Lấy danh sách attachments của card")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<List<KanbanAttachmentResponse>> getAttachmentsByCard(@PathVariable Long cardId) {
        List<KanbanAttachmentResponse> attachments = attachmentService.getAttachmentsByCardId(cardId);
        return ResponseEntity.ok(attachments);
    }

    @PostMapping("/cards/{cardId}/attachments")
    @Operation(summary = "Upload attachment cho card")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Attachment uploaded successfully"),
            @ApiResponse(responseCode = "404", description = "Card not found"),
            @ApiResponse(responseCode = "400", description = "Invalid file")
    })
    public ResponseEntity<KanbanAttachmentResponse> uploadAttachment(
            @PathVariable Long cardId,
            @RequestParam("file") MultipartFile file) throws IOException {
        KanbanAttachmentResponse response = attachmentService.uploadAttachment(cardId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/attachments/{id}")
    @Operation(summary = "Lấy chi tiết attachment")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Attachment not found")
    })
    public ResponseEntity<KanbanAttachmentResponse> getAttachmentById(@PathVariable Long id) {
        KanbanAttachmentResponse response = attachmentService.getAttachmentById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/attachments/{id}/download")
    @Operation(summary = "Download attachment - Redirect to S3 URL")
    @ApiResponses({
            @ApiResponse(responseCode = "302", description = "Redirect to file URL"),
            @ApiResponse(responseCode = "404", description = "Attachment not found")
    })
    public ResponseEntity<Void> downloadAttachment(@PathVariable Long id) {
        String downloadUrl = attachmentService.getDownloadUrl(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(java.net.URI.create(downloadUrl));

        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @DeleteMapping("/attachments/{id}")
    @Operation(summary = "Xóa attachment")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Attachment deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Attachment not found")
    })
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long id) {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }
}
