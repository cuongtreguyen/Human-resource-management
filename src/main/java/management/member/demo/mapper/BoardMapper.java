package management.member.demo.mapper;

import management.member.demo.dto.BoardResponse;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.KanbanLabelResponse;
import management.member.demo.dto.KanbanListResponse;
import management.member.demo.dto.KanbanCardResponse;
import management.member.demo.entity.Board;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.KanbanList;
import management.member.demo.entity.Task;
import management.member.demo.enums.TaskStatus;
import management.member.demo.repository.KanbanCardRepository;
import management.member.demo.repository.KanbanListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BoardMapper {

    @Autowired
    private EmployeeMapper employeeMapper;

    @Autowired
    private KanbanListRepository listRepository;

    @Autowired
    private KanbanCardRepository cardRepository;

    public BoardResponse toResponse(Board board) {
        List<Task> tasks = null;
        try {
            tasks = board.getTasks();
        } catch (Exception e) {
            // Nếu có lỗi lazy loading, set tasks = null
            tasks = null;
        }

        int total = tasks != null ? tasks.size() : 0;

        // Đếm số lượng task theo trạng thái
        long todo = countStatus(tasks, TaskStatus.NEW);
        long inProgress = countStatus(tasks, TaskStatus.IN_PROGRESS);
        long review = countStatus(tasks, TaskStatus.REVIEW);
        long done = countStatus(tasks, TaskStatus.COMPLETED);

        // Tính phần trăm tiến độ
        double progress = total > 0 ? ((double) done / total) * 100 : 0;

        // Map members to EmployeeResponse
        List<EmployeeResponse> memberResponses = new ArrayList<>();
        try {
            if (board.getMembers() != null) {
                memberResponses = board.getMembers().stream()
                        .map(employeeMapper::toResponse)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            // Lazy loading exception, keep empty list
        }

        // Map labels to KanbanLabelResponse
        List<KanbanLabelResponse> labelResponses = new ArrayList<>();
        try {
            if (board.getLabels() != null) {
                labelResponses = board.getLabels().stream()
                        .map(KanbanLabelResponse::fromEntity)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            // Lazy loading exception, keep empty list
        }

        // Load lists with cards
        List<KanbanListResponse> listResponses = new ArrayList<>();
        try {
            List<KanbanList> lists = listRepository.findByBoardIdAndArchivedFalseOrderByPositionAsc(board.getId());
            listResponses = lists.stream()
                    .map(list -> {
                        List<KanbanCard> cards = cardRepository.findByListIdAndArchivedFalseOrderByPositionAsc(list.getId());
                        List<KanbanCardResponse> cardResponses = cards.stream()
                                .map(this::toCardResponse)
                                .collect(Collectors.toList());
                        return KanbanListResponse.builder()
                                .id(list.getId())
                                .boardId(board.getId())
                                .name(list.getName())
                                .position(list.getPosition())
                                .archived(list.isArchived())
                                .cardCount(cards.size())
                                .cards(cardResponses)
                                .build();
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Keep empty list on error
        }

        return BoardResponse.builder()
                .id(board.getId())
                .name(board.getName())
                .createdAt(board.getCreatedAt())
                .members(memberResponses)
                .labels(labelResponses)
                .lists(listResponses)
                .memberCount(memberResponses.size())
                .progress(Math.round(progress * 10.0) / 10.0)
                .todoCount(todo)
                .inProgressCount(inProgress)
                .reviewCount(review)
                .doneCount(done)
                .build();
    }

    private long countStatus(List<Task> tasks, TaskStatus status) {
        if (tasks == null) return 0;
        return tasks.stream().filter(t -> t.getTaskStatus() == status).count();
    }

    private KanbanCardResponse toCardResponse(KanbanCard card) {
        return KanbanCardResponse.builder()
                .id(card.getId())
                .listId(card.getList().getId())
                .title(card.getTitle())
                .description(card.getDescription())
                .position(card.getPosition())
                .priority(card.getPriority())
                .dueDate(card.getDueDate())
                .assigneeIds(card.getAssigneeIds())
                .labelIds(card.getLabelIds())
                .attachmentCount(card.getAttachmentCount())
                .commentCount(card.getCommentCount())
                .checkItemStatus(card.getCheckItemStatus())
                .archived(card.isArchived())
                .createdAt(card.getCreatedAt())
                .updatedAt(card.getUpdatedAt())
                .build();
    }
}