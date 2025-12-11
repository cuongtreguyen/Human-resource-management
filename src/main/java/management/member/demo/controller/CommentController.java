package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.CommentResponse;
import management.member.demo.dto.CommentUpdateRequest;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Comment management for Task and Kanban Card")
public class CommentController {
    private final CommentService commentService;

    // ============== KANBAN CARD COMMENTS (RESTful) ==============

    @GetMapping("/cards/{cardId}/comments")
    @Operation(summary = "Lấy danh sách comment của Kanban Card")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<List<CommentResponse>> getCommentsByCard(@PathVariable Long cardId) {
        List<CommentResponse> comments = commentService.getCommentsByCardId(cardId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/cards/{cardId}/comments")
    @Operation(summary = "Tạo comment cho Kanban Card")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Comment created successfully"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<CommentResponse> createCardComment(
            @PathVariable Long cardId,
            @RequestBody Map<String, String> body) {
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Nội dung comment không được để trống");
        }
        CommentResponse response = commentService.createCardComment(cardId, content.trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============== COMMON COMMENT OPERATIONS ==============

    @PutMapping("/comments/{id}")
    @Operation(summary = "Cập nhật comment", description = "Update a comment. Chỉ nhân viên đã tạo comment mới có quyền cập nhật")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comment updated successfully"),
            @ApiResponse(responseCode = "404", description = "Comment not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Không có quyền cập nhật comment này")
    })
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentUpdateRequest request) {
        CommentResponse response = commentService.updateComment(id, request);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/comments/{id}")
    @Operation(summary = "Xóa comment", description = "Delete a comment. Chỉ nhân viên đã tạo comment mới có quyền xóa")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Comment deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Comment not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Không có quyền xóa comment này")
    })
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
