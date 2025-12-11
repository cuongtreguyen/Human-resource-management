package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import management.member.demo.dto.AddMemberRequest;
import management.member.demo.dto.BoardRequest;
import management.member.demo.dto.BoardResponse;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.UpdateBoardNameRequest;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
public class BoardController {
    @Autowired BoardService boardService;

    // GET /api/boards?search=Website
    @GetMapping
    @Operation(summary = "Lấy danh sách Board, có thể tìm kiếm theo tên", description = "Get all boards with optional search by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Boards retrieved successfully")
    })
    public ResponseEntity<List<BoardResponse>> getAllBoards(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(boardService.getAllBoards(search));
    }

    // GET /api/boards/my-boards
    @GetMapping("/my-boards")
    @Operation(summary = "Lấy tất cả boards mà nhân viên hiện tại là thành viên", description = "Get all boards where current employee is a member")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Boards retrieved successfully")
    })
    public ResponseEntity<List<BoardResponse>> getMyBoards() {
        return ResponseEntity.ok(boardService.getMyBoards());
    }

    // POST /api/boards
    @PostMapping
    @Operation(summary = "Tạo Board mới", description = "Create a new board")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Board created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<BoardResponse> createBoard(@RequestBody @Valid BoardRequest request) {
        return ResponseEntity.ok(boardService.createBoard(request));
    }
    // DELETE /api/boards/{id}
    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa Board theo ID", description = "Delete a board by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Board deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Board not found")
    })
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/boards/{id} - Lấy chi tiết board
    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết Board theo ID", description = "Get board details by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Board retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Board not found")
    })
    public ResponseEntity<BoardResponse> getBoardById(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getBoardById(id));
    }

    // PUT /api/boards/{id} - Cập nhật board
    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật tên Board", description = "Update the name of a board")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Board name updated successfully"),
            @ApiResponse(responseCode = "404", description = "Board not found")
    })
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable Long id,
            @RequestBody @Valid UpdateBoardNameRequest request) {
        return ResponseEntity.ok(boardService.updateBoardName(id, request));
    }

    // POST /api/boards/members - Thêm member (boardId trong request body)
    @PostMapping("/members")
    @Operation(summary = "Thêm thành viên vào Board", description = "Add a member to a board by email (boardId in request body)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Member added successfully"),
            @ApiResponse(responseCode = "404", description = "Board or Employee not found"),
            @ApiResponse(responseCode = "400", description = "Employee is already a member of the board or boardId is missing")
    })
    public ResponseEntity<BoardResponse> addMember(@RequestBody @Valid AddMemberRequest request) {
        if (request.getBoardId() == null) {
            throw new ResourceNotFoundException(ErrorCode.INVALID_BOARD_ID.getMessage());
        }
        return ResponseEntity.ok(boardService.addMemberToBoard(request));
    }

    // POST /api/boards/{id}/members - Thêm member (RESTful với boardId trong path)
    @PostMapping("/{id}/members")
    @Operation(summary = "Thêm thành viên vào Board", description = "Add a member to a board by email (boardId in path)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Member added successfully"),
            @ApiResponse(responseCode = "404", description = "Board or Employee not found"),
            @ApiResponse(responseCode = "400", description = "Employee is already a member of the board")
    })
    public ResponseEntity<BoardResponse> addMemberWithPathId(
            @PathVariable Long id,
            @RequestBody @Valid AddMemberRequest request) {
        request.setBoardId(id); // Set boardId từ path
        return ResponseEntity.ok(boardService.addMemberToBoard(request));
    }

    // DELETE /api/boards/{boardId}/members/{memberId} - Xóa member
    @DeleteMapping("/{boardId}/members/{memberId}")
    @Operation(summary = "Xóa thành viên khỏi Board", description = "Remove a member from a board")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Member removed successfully"),
            @ApiResponse(responseCode = "404", description = "Board or Member not found")
    })
    public ResponseEntity<Void> removeMember(
            @PathVariable Long boardId,
            @PathVariable Long memberId) {
        boardService.removeMemberFromBoard(boardId, memberId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/total")
    @Operation(summary = "Lấy tổng số Board", description = "Get the total number of boards")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Total boards retrieved successfully")
    })
    public ResponseEntity<Integer> getTotalBoards() {
        return ResponseEntity.ok(boardService.getTotalBoards());
    }

    @GetMapping("/{id}/members")
    @Operation(summary = "Lấy danh sách thành viên của Board", description = "Get all members of a board")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Members retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Board not found")
    })
    public ResponseEntity<List<EmployeeResponse>> getBoardMembers(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getBoardMembers(id));
    }
}