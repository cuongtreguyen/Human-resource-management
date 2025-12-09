package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.*;
import management.member.demo.service.KanbanCardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Kanban Card", description = "Kanban Card management endpoints")
public class KanbanCardController {

    private final KanbanCardService cardService;

    @PostMapping("/lists/{listId}/cards")
    @Operation(summary = "Tạo card mới trong list", description = "Create a new card in a list")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Card created successfully"),
            @ApiResponse(responseCode = "404", description = "List not found")
    })
    public ResponseEntity<KanbanCardResponse> createCard(
            @PathVariable Long listId,
            @RequestBody @Valid KanbanCardRequest request) {
        KanbanCardResponse response = cardService.createCard(listId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/lists/{listId}/cards")
    @Operation(summary = "Lấy tất cả cards của list", description = "Get all cards of a list")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    public ResponseEntity<List<KanbanCardResponse>> getCardsByListId(@PathVariable Long listId) {
        List<KanbanCardResponse> response = cardService.getCardsByListId(listId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cards/{cardId}")
    @Operation(summary = "Lấy chi tiết card", description = "Get card detail by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<KanbanCardResponse> getCardById(@PathVariable Long cardId) {
        KanbanCardResponse response = cardService.getCardById(cardId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/cards/{cardId}")
    @Operation(summary = "Cập nhật card", description = "Update card information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Card updated successfully"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<KanbanCardResponse> updateCard(
            @PathVariable Long cardId,
            @RequestBody @Valid KanbanCardUpdateRequest request) {
        KanbanCardResponse response = cardService.updateCard(cardId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/cards/{cardId}/move")
    @Operation(summary = "Di chuyển card", description = "Move card to another list or position")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Card moved successfully"),
            @ApiResponse(responseCode = "404", description = "Card or List not found")
    })
    public ResponseEntity<KanbanCardResponse> moveCard(
            @PathVariable Long cardId,
            @RequestBody @Valid KanbanCardMoveRequest request) {
        KanbanCardResponse response = cardService.moveCard(cardId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/cards/{cardId}/archive")
    @Operation(summary = "Archive/Unarchive card", description = "Toggle archive status of a card")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Card archive status toggled"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<KanbanCardResponse> toggleArchiveCard(@PathVariable Long cardId) {
        KanbanCardResponse response = cardService.toggleArchiveCard(cardId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cards/{cardId}")
    @Operation(summary = "Xóa card", description = "Delete a card")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Card deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<Void> deleteCard(@PathVariable Long cardId) {
        cardService.deleteCard(cardId);
        return ResponseEntity.noContent().build();
    }
}
