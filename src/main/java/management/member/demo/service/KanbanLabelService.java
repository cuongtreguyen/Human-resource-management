package management.member.demo.service;

import lombok.RequiredArgsConstructor;
import management.member.demo.dto.KanbanLabelRequest;
import management.member.demo.dto.KanbanLabelResponse;
import management.member.demo.dto.KanbanLabelUpdateRequest;
import management.member.demo.entity.Board;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.KanbanLabel;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.BoardRepository;
import management.member.demo.repository.KanbanCardRepository;
import management.member.demo.repository.KanbanLabelRepository;
import management.member.demo.repository.KanbanListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class KanbanLabelService {

    private final KanbanLabelRepository labelRepository;
    private final BoardRepository boardRepository;
    private final KanbanCardRepository cardRepository;
    private final KanbanListRepository listRepository;

    // Tạo label mới cho board
    public KanbanLabelResponse createLabel(Long boardId, KanbanLabelRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.BOARD_NOT_FOUND.getMessage()));

        KanbanLabel label = KanbanLabel.builder()
                .board(board)
                .name(request.getName())
                .color(request.getColor())
                .build();

        KanbanLabel savedLabel = labelRepository.save(label);
        return KanbanLabelResponse.fromEntity(savedLabel);
    }

    // Lấy tất cả labels của board
    public List<KanbanLabelResponse> getLabelsByBoard(Long boardId) {
        // Kiểm tra board tồn tại
        if (!boardRepository.existsById(boardId)) {
            throw new ResourceNotFoundException(ErrorCode.BOARD_NOT_FOUND.getMessage());
        }

        return labelRepository.findByBoardId(boardId).stream()
                .map(KanbanLabelResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Lấy label theo ID
    public KanbanLabelResponse getLabelById(Long labelId) {
        KanbanLabel label = labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.LABEL_NOT_FOUND.getMessage()));
        return KanbanLabelResponse.fromEntity(label);
    }

    // Cập nhật label
    public KanbanLabelResponse updateLabel(Long labelId, KanbanLabelUpdateRequest request) {
        KanbanLabel label = labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.LABEL_NOT_FOUND.getMessage()));

        if (request.getName() != null && !request.getName().isBlank()) {
            label.setName(request.getName());
        }

        if (request.getColor() != null) {
            label.setColor(request.getColor());
        }

        KanbanLabel savedLabel = labelRepository.save(label);
        return KanbanLabelResponse.fromEntity(savedLabel);
    }

    // Xóa label
    public void deleteLabel(Long labelId) {
        KanbanLabel label = labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.LABEL_NOT_FOUND.getMessage()));

        // Xóa label khỏi tất cả card có chứa nó
        List<KanbanCard> cardsWithLabel = cardRepository.findByLabelIdsContaining(labelId);
        for (KanbanCard card : cardsWithLabel) {
            card.getLabelIds().remove(labelId);
            cardRepository.save(card);
        }

        labelRepository.delete(label);
    }

    // Thêm label vào card
    public void addLabelToCard(Long cardId, Long labelId) {
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage()));

        KanbanLabel label = labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.LABEL_NOT_FOUND.getMessage()));

        // Kiểm tra label thuộc cùng board với card
        Long cardBoardId = card.getList().getBoard().getId();
        if (!label.getBoard().getId().equals(cardBoardId)) {
            throw new ResourceNotFoundException(ErrorCode.LABEL_NOT_IN_SAME_BOARD.getMessage());
        }

        if (card.getLabelIds() == null) {
            card.setLabelIds(new ArrayList<>());
        }

        if (!card.getLabelIds().contains(labelId)) {
            card.getLabelIds().add(labelId);
            cardRepository.save(card);
        }
    }

    // Xóa label khỏi card
    public void removeLabelFromCard(Long cardId, Long labelId) {
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage()));

        if (card.getLabelIds() != null && card.getLabelIds().contains(labelId)) {
            card.getLabelIds().remove(labelId);
            cardRepository.save(card);
        }
    }

    // Lấy danh sách labels của card
    public List<KanbanLabelResponse> getLabelsByCard(Long cardId) {
        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CARD_NOT_FOUND.getMessage()));

        if (card.getLabelIds() == null || card.getLabelIds().isEmpty()) {
            return new ArrayList<>();
        }

        return labelRepository.findByIdIn(card.getLabelIds()).stream()
                .map(KanbanLabelResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
