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

    @PostMapping("/members")
    @Operation(summary = "Thêm thành viên vào Board", description = "Add a member to a board by email. Board sẽ được tự động xác định dựa trên user hiện tại")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Member added successfully"),
            @ApiResponse(responseCode = "404", description = "Board or Employee not found"),
            @ApiResponse(responseCode = "400", description = "Employee is already a member of the board")
    })
    public ResponseEntity<BoardResponse> addMember(@RequestBody @Valid AddMemberRequest request) {
        return ResponseEntity.ok(boardService.addMemberToBoard(request));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Cập nhật tên Board", description = "Update the name of a board")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Board name updated successfully"),
            @ApiResponse(responseCode = "404", description = "Board not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<BoardResponse> updateBoardName(
            @PathVariable Long id,
            @RequestBody @Valid UpdateBoardNameRequest request) {
        return ResponseEntity.ok(boardService.updateBoardName(id, request));
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