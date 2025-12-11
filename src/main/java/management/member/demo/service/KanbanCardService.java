package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.KanbanList;
import management.member.demo.entity.User;
import management.member.demo.enums.KanbanCardPriority;
import management.member.demo.enums.Role;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ForbiddenException;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.KanbanCardMapper;
import management.member.demo.repository.EmployeeRepository;
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
public class KanbanCardService {

    private final KanbanCardRepository cardRepository;
    private final KanbanListRepository listRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final KanbanValidator kanbanValidator;
    private final KanbanCardMapper kanbanCardMapper;

    // Helper: Kiểm tra user có phải Manager/Admin không
    private boolean isManagerOrAdmin() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));
        Role role = user.getRole();
        return role == Role.MANAGER || role == Role.ADMIN;
    }

    // Tạo card mới trong list - CHỈ MANAGER/ADMIN
    public KanbanCardResponse createCard(Long listId, KanbanCardRequest request) {
        kanbanValidator.validateCreateCardRequest(listId, request);
        
        if (!isManagerOrAdmin()) {
            throw new ForbiddenException(ErrorCode.ACCESS_DENIED.getMessage());
        }

        KanbanList list = listRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.LIST_NOT_FOUND.getMessage()));

        // Lấy người tạo từ token
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Employee creator = employeeRepository.findByEmail(currentEmail).orElse(null);

        // Tính position mới (cuối danh sách)
        Double maxPosition = cardRepository.findMaxPositionByListId(listId);
        Double newPosition = (maxPosition != null) ? maxPosition + 1000.0 : 1000.0;

        KanbanCard card = KanbanCard.builder()
                .list(list)
                .creator(creator)
                .title(request.getTitle())
                .position(newPosition)
                .priority(KanbanCardPriority.MEDIUM)
                .archived(false)
                .build();

        KanbanCard savedCard = cardRepository.save(card);
        return kanbanCardMapper.toResponse(savedCard);
    }

    // Lấy tất cả cards của list
    public List<KanbanCardResponse> getCardsByListId(Long listId) {
        List<KanbanCard> cards = cardRepository.findByListIdAndArchivedFalseOrderByPositionAsc(listId);
        return cards.stream().map(kanbanCardMapper::toResponse).collect(Collectors.toList());
    }

    // Lấy chi tiết card
    public KanbanCardResponse getCardById(Long cardId) {
        kanbanValidator.validateCardId(cardId);
        
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage()));
        return kanbanCardMapper.toResponse(card);
    }

    // Cập nhật card
    public KanbanCardResponse updateCard(Long cardId, KanbanCardUpdateRequest request) {
        kanbanValidator.validateUpdateCardRequest(cardId, request);
        
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage()));

        if (request.getTitle() != null) {
            card.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            card.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            card.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            card.setDueDate(request.getDueDate());
        }
        if (request.getReminderDate() != null) {
            card.setReminderDate(request.getReminderDate());
        }
        if (request.getAssigneeIds() != null) {
            card.setAssigneeIds(request.getAssigneeIds());
        }
        if (request.getLabelIds() != null) {
            card.setLabelIds(request.getLabelIds());
        }

        KanbanCard savedCard = cardRepository.save(card);
        return kanbanCardMapper.toResponse(savedCard);
    }

    // Di chuyển card (đổi list và/hoặc position)
    public KanbanCardResponse moveCard(Long cardId, KanbanCardMoveRequest request) {
        kanbanValidator.validateMoveCardRequest(cardId, request);
        
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage()));

        // Đổi list nếu khác
        if (!card.getList().getId().equals(request.getListId())) {
            KanbanList newList = listRepository.findById(request.getListId())
                    .orElseThrow(() -> new ResourceNotFoundException("List không tồn tại với ID: " + request.getListId()));
            card.setList(newList);
        }

        card.setPosition(request.getPosition());
        KanbanCard savedCard = cardRepository.save(card);
        return kanbanCardMapper.toResponse(savedCard);
    }

    // Archive/Unarchive card
    public KanbanCardResponse toggleArchiveCard(Long cardId) {
        kanbanValidator.validateCardId(cardId);
        
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage()));

        card.setArchived(!card.isArchived());
        KanbanCard savedCard = cardRepository.save(card);
        return kanbanCardMapper.toResponse(savedCard);
    }

    // Xóa card
    public void deleteCard(Long cardId) {
        kanbanValidator.validateCardId(cardId);
        
        cardRepository.deleteById(cardId);
    }

}
