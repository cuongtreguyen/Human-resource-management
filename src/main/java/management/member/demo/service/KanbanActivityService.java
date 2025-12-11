package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import management.member.demo.dto.KanbanActivityResponse;
import management.member.demo.entity.Board;
import management.member.demo.entity.Employee;
import management.member.demo.entity.KanbanActivity;
import management.member.demo.entity.KanbanCard;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.KanbanActivityMapper;
import management.member.demo.repository.BoardRepository;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.KanbanActivityRepository;
import management.member.demo.repository.KanbanCardRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class KanbanActivityService {

    private final KanbanActivityRepository activityRepository;
    private final KanbanCardRepository cardRepository;
    private final BoardRepository boardRepository;
    private final EmployeeRepository employeeRepository;
    private final KanbanActivityMapper kanbanActivityMapper;

    public List<KanbanActivityResponse> getActivitiesByCardId(Long cardId) {
        if (!cardRepository.existsById(cardId)) {
            throw new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage());
        }

        return activityRepository.findByCardIdOrderByCreatedAtDesc(cardId).stream()
                .map(kanbanActivityMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<KanbanActivityResponse> getActivitiesByBoardId(Long boardId, int limit) {
        if (!boardRepository.existsById(boardId)) {
            throw new ResourceNotFoundException(ErrorCode.BOARD_NOT_FOUND.getMessage());
        }

        if (limit > 0) {
            return activityRepository.findByBoardIdOrderByCreatedAtDesc(boardId, PageRequest.of(0, limit))
                    .getContent().stream()
                    .map(kanbanActivityMapper::toResponse)
                    .collect(Collectors.toList());
        }

        return activityRepository.findByBoardIdOrderByCreatedAtDesc(boardId).stream()
                .map(kanbanActivityMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void logActivity(Long cardId, Long boardId, String action, String description, String oldValue, String newValue) {
        Employee actor = getCurrentEmployee();

        KanbanCard card = cardId != null ? cardRepository.findById(cardId).orElse(null) : null;
        Board board = boardId != null ? boardRepository.findById(boardId).orElse(null) : null;

        // If card is provided but board is not, get board from card
        if (card != null && board == null) {
            board = card.getList().getBoard();
        }

        KanbanActivity activity = KanbanActivity.builder()
                .card(card)
                .board(board)
                .actor(actor)
                .action(action)
                .description(description)
                .oldValue(oldValue)
                .newValue(newValue)
                .build();

        activityRepository.save(activity);
    }

    public void logCardCreated(KanbanCard card) {
        logActivity(card.getId(), null, "CREATE_CARD",
                "Tạo thẻ \"" + card.getTitle() + "\"", null, card.getTitle());
    }

    public void logCardUpdated(KanbanCard card, String field, String oldValue, String newValue) {
        logActivity(card.getId(), null, "UPDATE_CARD",
                "Cập nhật " + field + " của thẻ \"" + card.getTitle() + "\"", oldValue, newValue);
    }

    public void logCardMoved(KanbanCard card, String fromList, String toList) {
        logActivity(card.getId(), null, "MOVE_CARD",
                "Di chuyển thẻ \"" + card.getTitle() + "\" từ \"" + fromList + "\" sang \"" + toList + "\"",
                fromList, toList);
    }

    public void logCommentAdded(Long cardId, String commentPreview) {
        KanbanCard card = cardRepository.findById(cardId).orElse(null);
        String cardTitle = card != null ? card.getTitle() : "Unknown";
        logActivity(cardId, null, "ADD_COMMENT",
                "Thêm bình luận vào thẻ \"" + cardTitle + "\"", null, commentPreview);
    }

    private Employee getCurrentEmployee() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) return null;

        String currentEmail = authentication.getName();
        return employeeRepository.findByEmail(currentEmail).orElse(null);
    }

}
