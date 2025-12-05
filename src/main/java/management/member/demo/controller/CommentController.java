package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.CommentRequest;
import management.member.demo.dto.CommentResponse;
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
}
