package management.member.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import management.member.demo.dto.KanbanActivityResponse;
import management.member.demo.service.KanbanActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Kanban Activity", description = "Activity log for Kanban cards and boards")
public class KanbanActivityController {

    private final KanbanActivityService activityService;

    @GetMapping("/cards/{cardId}/activities")
    @Operation(summary = "Lấy danh sách activities của card")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Card not found")
    })
    public ResponseEntity<List<KanbanActivityResponse>> getActivitiesByCard(@PathVariable Long cardId) {
        List<KanbanActivityResponse> activities = activityService.getActivitiesByCardId(cardId);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/boards/{boardId}/activities")
    @Operation(summary = "Lấy danh sách activities của board")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Board not found")
    })
    public ResponseEntity<List<KanbanActivityResponse>> getActivitiesByBoard(
            @PathVariable Long boardId,
            @RequestParam(defaultValue = "50") int limit) {
        List<KanbanActivityResponse> activities = activityService.getActivitiesByBoardId(boardId, limit);
        return ResponseEntity.ok(activities);
    }
}
