package management.member.demo.validator;

import management.member.demo.dto.KanbanCardMoveRequest;
import management.member.demo.dto.KanbanCardRequest;
import management.member.demo.dto.KanbanCardUpdateRequest;
import management.member.demo.dto.KanbanListArchiveRequest;
import management.member.demo.dto.KanbanListMoveRequest;
import management.member.demo.dto.KanbanListRequest;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.repository.BoardRepository;
import management.member.demo.repository.KanbanCardRepository;
import management.member.demo.repository.KanbanListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class KanbanValidator {

    @Autowired
    private KanbanListRepository listRepository;

    @Autowired
    private KanbanCardRepository cardRepository;

    @Autowired
    private BoardRepository boardRepository;

    // KanbanList validations
    public void validateCreateListRequest(Long boardId, KanbanListRequest request) {
        if (boardId == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Board ID is required");
        }

        if (!boardRepository.existsById(boardId)) {
            throw ErrorCode.INVALID_REQUEST.toException("Board not found with ID: " + boardId);
        }

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("List request cannot be null");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("List name is required");
        }

        if (request.getName().length() > 255) {
            throw ErrorCode.INVALID_REQUEST.toException("List name must not exceed 255 characters");
        }
    }

    public void validateUpdateListRequest(Long listId, KanbanListRequest request) {
        validateListId(listId);

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("List request cannot be null");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("List name is required");
        }

        if (request.getName().length() > 255) {
            throw ErrorCode.INVALID_REQUEST.toException("List name must not exceed 255 characters");
        }
    }

    public void validateListId(Long listId) {
        if (listId == null) {
            throw ErrorCode.INVALID_REQUEST.toException("List ID is required");
        }

        if (!listRepository.existsById(listId)) {
            throw ErrorCode.INVALID_REQUEST.toException("List not found with ID: " + listId);
        }
    }

    public void validateArchiveListRequest(Long listId, KanbanListArchiveRequest request) {
        validateListId(listId);

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Archive request cannot be null");
        }
    }

    public void validateMoveListRequest(Long listId, KanbanListMoveRequest request) {
        validateListId(listId);

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Move request cannot be null");
        }

        if (request.getPosition() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Position is required");
        }
    }

    // KanbanCard validations
    public void validateCreateCardRequest(Long listId, KanbanCardRequest request) {
        validateListId(listId);

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Card request cannot be null");
        }

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Card title is required");
        }

        if (request.getTitle().length() > 255) {
            throw ErrorCode.INVALID_REQUEST.toException("Card title must not exceed 255 characters");
        }
    }

    public void validateUpdateCardRequest(Long cardId, KanbanCardUpdateRequest request) {
        validateCardId(cardId);

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Card update request cannot be null");
        }

        if (request.getTitle() != null && request.getTitle().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Card title cannot be empty");
        }

        if (request.getTitle() != null && request.getTitle().length() > 255) {
            throw ErrorCode.INVALID_REQUEST.toException("Card title must not exceed 255 characters");
        }
    }

    public void validateCardId(Long cardId) {
        if (cardId == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Card ID is required");
        }

        if (!cardRepository.existsById(cardId)) {
            throw ErrorCode.INVALID_REQUEST.toException("Card not found with ID: " + cardId);
        }
    }

    public void validateMoveCardRequest(Long cardId, KanbanCardMoveRequest request) {
        validateCardId(cardId);

        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Move request cannot be null");
        }

        if (request.getListId() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("List ID is required");
        }

        if (!listRepository.existsById(request.getListId())) {
            throw ErrorCode.INVALID_REQUEST.toException("List not found with ID: " + request.getListId());
        }

        if (request.getPosition() == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Position is required");
        }
    }
}

