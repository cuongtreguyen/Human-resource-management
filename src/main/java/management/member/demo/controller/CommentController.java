package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.CommentRequest;
import management.member.demo.dto.CommentResponse;
import management.member.demo.dto.CommentUpdateRequest;
import management.member.demo.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/create")
    @Operation(summary = "Tạo comment mới", description = "Create a new comment")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Comment created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentRequest request) {
        CommentResponse response = commentService.createComment(request);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/get-cmt/{taskId}")
    @Operation(summary = "Lấy danh sách comment theo Task ID", description = "Get comments by Task ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comments retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<java.util.List<CommentResponse>> getCommentsByTaskID(@PathVariable Long taskId) {
        java.util.List<CommentResponse> responses = commentService.getCommentsByTaskID(taskId);
        return ResponseEntity.ok().body(responses);
    }

    @PutMapping("/{id}")
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

    @DeleteMapping("/{id}")
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
