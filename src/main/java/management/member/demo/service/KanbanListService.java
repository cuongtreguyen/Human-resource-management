package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import management.member.demo.dto.*;
import management.member.demo.entity.Board;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.KanbanList;
import management.member.demo.entity.User;
import management.member.demo.enums.Role;
import management.member.demo.exception.specifiic.ForbiddenException;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.BoardRepository;
import management.member.demo.repository.KanbanCardRepository;
import management.member.demo.repository.KanbanListRepository;
import management.member.demo.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class KanbanListService {

    private final KanbanListRepository listRepository;
    private final KanbanCardRepository cardRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    // Helper: Kiểm tra user có phải Manager/Admin không
    private boolean isManagerOrAdmin() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));
        Role role = user.getRole();
        return role == Role.MANAGER || role == Role.ADMIN;
    }

    // Tạo list mới trong board - CHỈ MANAGER/ADMIN
    public KanbanListResponse createList(Long boardId, KanbanListRequest request) {
        if (!isManagerOrAdmin()) {
            throw new ForbiddenException("Chỉ Manager hoặc Admin mới có quyền tạo List");
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board không tồn tại với ID: " + boardId));

        // Tính position mới (cuối danh sách)
        Double maxPosition = listRepository.findMaxPositionByBoardId(boardId);
        Double newPosition = (maxPosition != null) ? maxPosition + 1000.0 : 1000.0;

        KanbanList kanbanList = KanbanList.builder()
                .board(board)
                .name(request.getName())
                .position(newPosition)
                .archived(false)
                .build();

        KanbanList savedList = listRepository.save(kanbanList);
        return toResponse(savedList);
    }

    // Lấy tất cả lists của board (kèm cards)
    public List<KanbanListResponse> getListsByBoardId(Long boardId) {
        List<KanbanList> lists = listRepository.findByBoardIdAndArchivedFalseOrderByPositionAsc(boardId);

        return lists.stream()
                .map(list -> {
                    KanbanListResponse response = toResponse(list);
                    // Lấy cards của list
                    List<KanbanCard> cards = cardRepository.findByListIdAndArchivedFalseOrderByPositionAsc(list.getId());
                    response.setCards(cards.stream().map(this::toCardResponse).collect(Collectors.toList()));
                    response.setCardCount(cards.size());
                    return response;
                })
                .collect(Collectors.toList());
    }

    // Cập nhật list
    public KanbanListResponse updateList(Long listId, KanbanListRequest request) {
        KanbanList list = listRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List không tồn tại với ID: " + listId));

        list.setName(request.getName());
        KanbanList savedList = listRepository.save(list);
        return toResponse(savedList);
    }

    // Archive/Unarchive list
    public KanbanListResponse archiveList(Long listId, KanbanListArchiveRequest request) {
        KanbanList list = listRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List không tồn tại với ID: " + listId));

        list.setArchived(request.isArchived());
        KanbanList savedList = listRepository.save(list);
        return toResponse(savedList);
    }

    // Di chuyển list (thay đổi position)
    public KanbanListResponse moveList(Long listId, KanbanListMoveRequest request) {
        KanbanList list = listRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List không tồn tại với ID: " + listId));

        list.setPosition(request.getPosition());
        KanbanList savedList = listRepository.save(list);
        return toResponse(savedList);
    }

    // Xóa list
    public void deleteList(Long listId) {
        if (!listRepository.existsById(listId)) {
            throw new ResourceNotFoundException("List không tồn tại với ID: " + listId);
        }
        listRepository.deleteById(listId);
    }

    // Helper: Convert entity to response
    private KanbanListResponse toResponse(KanbanList list) {
        return KanbanListResponse.builder()
                .id(list.getId())
                .boardId(list.getBoard().getId())
                .name(list.getName())
                .position(list.getPosition())
                .archived(list.isArchived())
                .build();
    }

    // Helper: Convert card entity to response
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
