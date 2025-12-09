package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.KanbanList;
import management.member.demo.enums.KanbanCardPriority;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.KanbanCardRepository;
import management.member.demo.repository.KanbanListRepository;
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

    // Tạo card mới trong list
    public KanbanCardResponse createCard(Long listId, KanbanCardRequest request) {
        KanbanList list = listRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List không tồn tại với ID: " + listId));

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
        return toResponse(savedCard);
    }

    // Lấy tất cả cards của list
    public List<KanbanCardResponse> getCardsByListId(Long listId) {
        List<KanbanCard> cards = cardRepository.findByListIdAndArchivedFalseOrderByPositionAsc(listId);
        return cards.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Lấy chi tiết card
    public KanbanCardResponse getCardById(Long cardId) {
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card không tồn tại với ID: " + cardId));
        return toResponse(card);
    }

    // Cập nhật card
    public KanbanCardResponse updateCard(Long cardId, KanbanCardUpdateRequest request) {
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card không tồn tại với ID: " + cardId));

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
        return toResponse(savedCard);
    }

    // Di chuyển card (đổi list và/hoặc position)
    public KanbanCardResponse moveCard(Long cardId, KanbanCardMoveRequest request) {
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card không tồn tại với ID: " + cardId));

        // Đổi list nếu khác
        if (!card.getList().getId().equals(request.getListId())) {
            KanbanList newList = listRepository.findById(request.getListId())
                    .orElseThrow(() -> new ResourceNotFoundException("List không tồn tại với ID: " + request.getListId()));
            card.setList(newList);
        }

        card.setPosition(request.getPosition());
        KanbanCard savedCard = cardRepository.save(card);
        return toResponse(savedCard);
    }

    // Archive/Unarchive card
    public KanbanCardResponse toggleArchiveCard(Long cardId) {
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card không tồn tại với ID: " + cardId));

        card.setArchived(!card.isArchived());
        KanbanCard savedCard = cardRepository.save(card);
        return toResponse(savedCard);
    }

    // Xóa card
    public void deleteCard(Long cardId) {
        if (!cardRepository.existsById(cardId)) {
            throw new ResourceNotFoundException("Card không tồn tại với ID: " + cardId);
        }
        cardRepository.deleteById(cardId);
    }

    // Helper: Convert entity to response
    private KanbanCardResponse toResponse(KanbanCard card) {
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
