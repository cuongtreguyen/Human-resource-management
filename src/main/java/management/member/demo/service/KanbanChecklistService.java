package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import management.member.demo.dto.KanbanChecklistRequest;
import management.member.demo.dto.KanbanChecklistResponse;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.KanbanChecklist;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
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

    public List<KanbanChecklistResponse> getChecklistsByCardId(Long cardId) {
        if (!cardRepository.existsById(cardId)) {
            throw new ResourceNotFoundException("Card không tồn tại với ID: " + cardId);
        }

        return checklistRepository.findByCardIdOrderByPositionAsc(cardId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public KanbanChecklistResponse createChecklist(Long cardId, KanbanChecklistRequest request) {
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card không tồn tại với ID: " + cardId));

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

        return toResponse(saved);
    }

    public KanbanChecklistResponse updateChecklist(Long checklistId, KanbanChecklistRequest request) {
        KanbanChecklist checklist = checklistRepository.findById(checklistId)
                .orElseThrow(() -> new ResourceNotFoundException("Checklist không tồn tại với ID: " + checklistId));

        checklist.setTitle(request.getTitle());
        if (request.getPosition() != null) {
            checklist.setPosition(request.getPosition());
        }

        return toResponse(checklistRepository.save(checklist));
    }

    public KanbanChecklistResponse toggleChecklist(Long checklistId) {
        KanbanChecklist checklist = checklistRepository.findById(checklistId)
                .orElseThrow(() -> new ResourceNotFoundException("Checklist không tồn tại với ID: " + checklistId));

        checklist.setCompleted(!checklist.isCompleted());
        KanbanChecklist saved = checklistRepository.save(checklist);

        // Update checkItemStatus on card
        updateCardCheckItemStatus(checklist.getCard().getId());

        return toResponse(saved);
    }

    public void deleteChecklist(Long checklistId) {
        KanbanChecklist checklist = checklistRepository.findById(checklistId)
                .orElseThrow(() -> new ResourceNotFoundException("Checklist không tồn tại với ID: " + checklistId));

        Long cardId = checklist.getCard().getId();
        checklistRepository.delete(checklist);

        // Update checkItemStatus on card
        updateCardCheckItemStatus(cardId);
    }

    public KanbanChecklistResponse getChecklistById(Long checklistId) {
        KanbanChecklist checklist = checklistRepository.findById(checklistId)
                .orElseThrow(() -> new ResourceNotFoundException("Checklist không tồn tại với ID: " + checklistId));
        return toResponse(checklist);
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

    private KanbanChecklistResponse toResponse(KanbanChecklist checklist) {
        return KanbanChecklistResponse.builder()
                .id(checklist.getId())
                .cardId(checklist.getCard().getId())
                .title(checklist.getTitle())
                .completed(checklist.isCompleted())
                .position(checklist.getPosition())
                .createdAt(checklist.getCreatedAt())
                .updatedAt(checklist.getUpdatedAt())
                .build();
    }
}
