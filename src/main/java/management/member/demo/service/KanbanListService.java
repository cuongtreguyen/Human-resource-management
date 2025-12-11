package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import management.member.demo.dto.*;
import management.member.demo.entity.Board;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.KanbanList;
import management.member.demo.entity.User;
import management.member.demo.enums.Role;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ForbiddenException;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.KanbanListMapper;
import management.member.demo.repository.BoardRepository;
import management.member.demo.repository.KanbanCardRepository;
import management.member.demo.repository.KanbanListRepository;
import management.member.demo.repository.UserRepository;
import management.member.demo.validator.KanbanValidator;
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
    private final KanbanValidator kanbanValidator;
    private final KanbanListMapper kanbanListMapper;

    // Helper: Kiểm tra user có phải Manager/Admin không
    private boolean isManagerOrAdmin() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));
        Role role = user.getRole();
        return role == Role.MANAGER || role == Role.ADMIN;
    }

    // Tạo list mới trong board - CHỈ MANAGER/ADMIN
    public KanbanListResponse createList(Long boardId, KanbanListRequest request) {
        kanbanValidator.validateCreateListRequest(boardId, request);
        
        if (!isManagerOrAdmin()) {
            throw new ForbiddenException(ErrorCode.ACCESS_DENIED.getMessage());
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.BOARD_NOT_FOUND.getMessage()));

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
        return kanbanListMapper.toResponse(savedList);
    }

    // Lấy tất cả lists của board (kèm cards)
    public List<KanbanListResponse> getListsByBoardId(Long boardId) {
        List<KanbanList> lists = listRepository.findByBoardIdAndArchivedFalseOrderByPositionAsc(boardId);

        return lists.stream()
                .map(list -> {
                    KanbanListResponse response = kanbanListMapper.toResponse(list);
                    // Lấy cards của list
                    List<KanbanCard> cards = cardRepository.findByListIdAndArchivedFalseOrderByPositionAsc(list.getId());
                    response.setCards(cards.stream().map(kanbanListMapper::toCardResponse).collect(Collectors.toList()));
                    response.setCardCount(cards.size());
                    return response;
                })
                .collect(Collectors.toList());
    }

    // Cập nhật list
    public KanbanListResponse updateList(Long listId, KanbanListRequest request) {
        kanbanValidator.validateUpdateListRequest(listId, request);
        
        KanbanList list = listRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.LIST_NOT_FOUND.getMessage()));

        list.setName(request.getName());
        KanbanList savedList = listRepository.save(list);
        return kanbanListMapper.toResponse(savedList);
    }

    // Archive/Unarchive list
    public KanbanListResponse archiveList(Long listId, KanbanListArchiveRequest request) {
        kanbanValidator.validateArchiveListRequest(listId, request);
        
        KanbanList list = listRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.LIST_NOT_FOUND.getMessage()));

        list.setArchived(request.isArchived());
        KanbanList savedList = listRepository.save(list);
        return kanbanListMapper.toResponse(savedList);
    }

    // Di chuyển list (thay đổi position)
    public KanbanListResponse moveList(Long listId, KanbanListMoveRequest request) {
        kanbanValidator.validateMoveListRequest(listId, request);
        
        KanbanList list = listRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.LIST_NOT_FOUND.getMessage()));

        list.setPosition(request.getPosition());
        KanbanList savedList = listRepository.save(list);
        return kanbanListMapper.toResponse(savedList);
    }

    // Xóa list
    public void deleteList(Long listId) {
        kanbanValidator.validateListId(listId);
        
        listRepository.deleteById(listId);
    }

}
