package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.KanbanChecklistRequest;
import management.member.demo.dto.KanbanChecklistResponse;
import management.member.demo.service.KanbanChecklistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Kanban Checklist", description = "Checklist management for Kanban cards")
public class KanbanChecklistController {

    private final KanbanChecklistService checklistService;

    @GetMapping("/cards/{cardId}/checklists")
    @Operation(summary = "Lấy danh sách checklists của card")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<List<KanbanChecklistResponse>> getChecklistsByCard(@PathVariable Long cardId) {
        List<KanbanChecklistResponse> checklists = checklistService.getChecklistsByCardId(cardId);
        return ResponseEntity.ok(checklists);
    }

    @PostMapping("/cards/{cardId}/checklists")
    @Operation(summary = "Tạo checklist item mới cho card")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Checklist created successfully"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<KanbanChecklistResponse> createChecklist(
            @PathVariable Long cardId,
            @RequestBody @Valid KanbanChecklistRequest request) {
        KanbanChecklistResponse response = checklistService.createChecklist(cardId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/checklists/{id}")
    @Operation(summary = "Lấy chi tiết checklist")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Checklist not found")
    })
    public ResponseEntity<KanbanChecklistResponse> getChecklistById(@PathVariable Long id) {
        KanbanChecklistResponse response = checklistService.getChecklistById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/checklists/{id}")
    @Operation(summary = "Cập nhật checklist")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Checklist updated successfully"),
            @ApiResponse(responseCode = "404", description = "Checklist not found")
    })
    public ResponseEntity<KanbanChecklistResponse> updateChecklist(
            @PathVariable Long id,
            @RequestBody @Valid KanbanChecklistRequest request) {
        KanbanChecklistResponse response = checklistService.updateChecklist(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/checklists/{id}/toggle")
    @Operation(summary = "Toggle trạng thái hoàn thành của checklist")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Checklist toggled successfully"),
            @ApiResponse(responseCode = "404", description = "Checklist not found")
    })
    public ResponseEntity<KanbanChecklistResponse> toggleChecklist(@PathVariable Long id) {
        KanbanChecklistResponse response = checklistService.toggleChecklist(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/checklists/{id}")
    @Operation(summary = "Xóa checklist")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Checklist deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Checklist not found")
    })
    public ResponseEntity<Void> deleteChecklist(@PathVariable Long id) {
        checklistService.deleteChecklist(id);
        return ResponseEntity.noContent().build();
    }
}
