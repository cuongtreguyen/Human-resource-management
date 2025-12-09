package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.KanbanLabelRequest;
import management.member.demo.dto.KanbanLabelResponse;
import management.member.demo.dto.KanbanLabelUpdateRequest;
import management.member.demo.service.KanbanLabelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Kanban Label", description = "Kanban Label management endpoints")
public class KanbanLabelController {

    private final KanbanLabelService labelService;

    @PostMapping("/boards/{boardId}/labels")
    @Operation(summary = "Tạo label mới cho board", description = "Create a new label for a board")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Label created successfully"),
            @ApiResponse(responseCode = "404", description = "Board not found")
    })
    public ResponseEntity<KanbanLabelResponse> createLabel(
            @PathVariable Long boardId,
            @RequestBody @Valid KanbanLabelRequest request) {
        KanbanLabelResponse response = labelService.createLabel(boardId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/boards/{boardId}/labels")
    @Operation(summary = "Lấy tất cả labels của board", description = "Get all labels of a board")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Board not found")
    })
    public ResponseEntity<List<KanbanLabelResponse>> getLabelsByBoard(@PathVariable Long boardId) {
        List<KanbanLabelResponse> response = labelService.getLabelsByBoard(boardId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/labels/{labelId}")
    @Operation(summary = "Lấy chi tiết label", description = "Get label detail by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Label not found")
    })
    public ResponseEntity<KanbanLabelResponse> getLabelById(@PathVariable Long labelId) {
        KanbanLabelResponse response = labelService.getLabelById(labelId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/labels/{labelId}")
    @Operation(summary = "Cập nhật label", description = "Update label information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Label updated successfully"),
            @ApiResponse(responseCode = "404", description = "Label not found")
    })
    public ResponseEntity<KanbanLabelResponse> updateLabel(
            @PathVariable Long labelId,
            @RequestBody @Valid KanbanLabelUpdateRequest request) {
        KanbanLabelResponse response = labelService.updateLabel(labelId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/labels/{labelId}")
    @Operation(summary = "Xóa label", description = "Delete a label")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Label deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Label not found")
    })
    public ResponseEntity<Void> deleteLabel(@PathVariable Long labelId) {
        labelService.deleteLabel(labelId);
        return ResponseEntity.noContent().build();
    }

    // Card-Label operations

    @PostMapping("/cards/{cardId}/labels/{labelId}")
    @Operation(summary = "Thêm label vào card", description = "Add a label to a card")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Label added to card successfully"),
            @ApiResponse(responseCode = "404", description = "Card or Label not found"),
            @ApiResponse(responseCode = "400", description = "Label does not belong to the same board as the card")
    })
    public ResponseEntity<Void> addLabelToCard(
            @PathVariable Long cardId,
            @PathVariable Long labelId) {
        labelService.addLabelToCard(cardId, labelId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cards/{cardId}/labels/{labelId}")
    @Operation(summary = "Xóa label khỏi card", description = "Remove a label from a card")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Label removed from card successfully"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<Void> removeLabelFromCard(
            @PathVariable Long cardId,
            @PathVariable Long labelId) {
        labelService.removeLabelFromCard(cardId, labelId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cards/{cardId}/labels")
    @Operation(summary = "Lấy danh sách labels của card", description = "Get all labels of a card")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<List<KanbanLabelResponse>> getLabelsByCard(@PathVariable Long cardId) {
        List<KanbanLabelResponse> response = labelService.getLabelsByCard(cardId);
        return ResponseEntity.ok(response);
    }
}
