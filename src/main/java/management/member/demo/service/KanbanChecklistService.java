package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import management.member.demo.dto.KanbanChecklistRequest;
import management.member.demo.dto.KanbanChecklistResponse;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.KanbanChecklist;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.KanbanChecklistMapper;
import management.member.demo.repository.KanbanCardRepository;
import management.member.demo.repository.KanbanChecklistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class KanbanChecklistService {

    private final KanbanChecklistRepository checklistRepository;
    private final KanbanCardRepository cardRepository;
    private final KanbanChecklistMapper kanbanChecklistMapper;

    public List<KanbanChecklistResponse> getChecklistsByCardId(Long cardId) {
        if (!cardRepository.existsById(cardId)) {
            throw new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage());
        }

        return checklistRepository.findByCardIdOrderByPositionAsc(cardId).stream()
                .map(kanbanChecklistMapper::toResponse)
                .collect(Collectors.toList());
    }

    public KanbanChecklistResponse createChecklist(Long cardId, KanbanChecklistRequest request) {
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage()));

        Integer maxPosition = checklistRepository.findMaxPositionByCardId(cardId);
        int newPosition = (maxPosition != null) ? maxPosition + 1 : 0;

        KanbanChecklist checklist = KanbanChecklist.builder()
                .card(card)
                .title(request.getTitle())
                .completed(false)
                .position(request.getPosition() != null ? request.getPosition() : newPosition)
                .build();

        KanbanChecklist saved = checklistRepository.save(checklist);

        // Update checkItemStatus on card
        updateCardCheckItemStatus(cardId);

        return kanbanChecklistMapper.toResponse(saved);
    }

    public KanbanChecklistResponse updateChecklist(Long checklistId, KanbanChecklistRequest request) {
        KanbanChecklist checklist = checklistRepository.findById(checklistId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CHECKLIST_NOT_FOUND.getMessage()));

        checklist.setTitle(request.getTitle());
        if (request.getPosition() != null) {
            checklist.setPosition(request.getPosition());
        }

        return kanbanChecklistMapper.toResponse(checklistRepository.save(checklist));
    }

    public KanbanChecklistResponse toggleChecklist(Long checklistId) {
        KanbanChecklist checklist = checklistRepository.findById(checklistId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CHECKLIST_NOT_FOUND.getMessage()));

        checklist.setCompleted(!checklist.isCompleted());
        KanbanChecklist saved = checklistRepository.save(checklist);

        // Update checkItemStatus on card
        updateCardCheckItemStatus(checklist.getCard().getId());

        return kanbanChecklistMapper.toResponse(saved);
    }

    public void deleteChecklist(Long checklistId) {
        KanbanChecklist checklist = checklistRepository.findById(checklistId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CHECKLIST_NOT_FOUND.getMessage()));

        Long cardId = checklist.getCard().getId();
        checklistRepository.delete(checklist);

        // Update checkItemStatus on card
        updateCardCheckItemStatus(cardId);
    }

    public KanbanChecklistResponse getChecklistById(Long checklistId) {
        KanbanChecklist checklist = checklistRepository.findById(checklistId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CHECKLIST_NOT_FOUND.getMessage()));
        return kanbanChecklistMapper.toResponse(checklist);
    }

    private void updateCardCheckItemStatus(Long cardId) {
        int total = checklistRepository.countByCardId(cardId);
        int completed = checklistRepository.countCompletedByCardId(cardId);

        KanbanCard card = cardRepository.findById(cardId).orElse(null);
        if (card != null) {
            card.setCheckItemStatus(completed + "/" + total);
            cardRepository.save(card);
        }
    }

}
