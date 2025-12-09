package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.*;
import management.member.demo.service.KanbanListService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Kanban List", description = "Kanban List management endpoints")
public class KanbanListController {

    private final KanbanListService listService;

    @PostMapping("/boards/{boardId}/lists")
    @Operation(summary = "Tạo list mới trong board", description = "Create a new list in a board")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "List created successfully"),
            @ApiResponse(responseCode = "404", description = "Board not found")
    })
    public ResponseEntity<KanbanListResponse> createList(
            @PathVariable Long boardId,
            @RequestBody @Valid KanbanListRequest request) {
        KanbanListResponse response = listService.createList(boardId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/boards/{boardId}/lists")
    @Operation(summary = "Lấy tất cả lists của board", description = "Get all lists of a board with cards")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<List<KanbanListResponse>> getListsByBoardId(@PathVariable Long boardId) {
        List<KanbanListResponse> response = listService.getListsByBoardId(boardId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/lists/{listId}")
    @Operation(summary = "Cập nhật list", description = "Update list name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List updated successfully"),
            @ApiResponse(responseCode = "404", description = "List not found")
    })
    public ResponseEntity<KanbanListResponse> updateList(
            @PathVariable Long listId,
            @RequestBody @Valid KanbanListRequest request) {
        KanbanListResponse response = listService.updateList(listId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/lists/{listId}/archive")
    @Operation(summary = "Archive/Unarchive list", description = "Archive or unarchive a list")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List archived/unarchived successfully"),
            @ApiResponse(responseCode = "404", description = "List not found")
    })
    public ResponseEntity<KanbanListResponse> archiveList(
            @PathVariable Long listId,
            @RequestBody KanbanListArchiveRequest request) {
        KanbanListResponse response = listService.archiveList(listId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/lists/{listId}/move")
    @Operation(summary = "Di chuyển list", description = "Move list to a new position")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List moved successfully"),
            @ApiResponse(responseCode = "404", description = "List not found")
    })
    public ResponseEntity<KanbanListResponse> moveList(
            @PathVariable Long listId,
            @RequestBody @Valid KanbanListMoveRequest request) {
        KanbanListResponse response = listService.moveList(listId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/lists/{listId}")
    @Operation(summary = "Xóa list", description = "Delete a list")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "List deleted successfully"),
            @ApiResponse(responseCode = "404", description = "List not found")
    })
    public ResponseEntity<Void> deleteList(@PathVariable Long listId) {
        listService.deleteList(listId);
        return ResponseEntity.noContent().build();
    }
}
