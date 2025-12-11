package management.member.demo.validator;

import management.member.demo.dto.AddMemberRequest;
import management.member.demo.dto.BoardRequest;
import management.member.demo.dto.UpdateBoardNameRequest;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.repository.BoardRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BoardValidator {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public void validateCreateBoardRequest(BoardRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Board request cannot be null");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Board name is required");
        }

        if (request.getName().length() > 255) {
            throw ErrorCode.INVALID_REQUEST.toException("Board name must not exceed 255 characters");
        }
    }

    public void validateAddMemberRequest(AddMemberRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Add member request cannot be null");
        }

        if (request.getBoardId() != null) {
            if (!boardRepository.existsById(request.getBoardId())) {
                throw ErrorCode.INVALID_REQUEST.toException("Board not found with ID: " + request.getBoardId());
            }
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Email is required");
        }

        if (!employeeRepository.existsByEmail(request.getEmail())) {
            throw ErrorCode.INVALID_REQUEST.toException("Employee not found with email: " + request.getEmail());
        }
    }

    public void validateUpdateBoardNameRequest(UpdateBoardNameRequest request) {
        if (request == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Update board name request cannot be null");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw ErrorCode.INVALID_REQUEST.toException("Board name is required");
        }

        if (request.getName().length() > 255) {
            throw ErrorCode.INVALID_REQUEST.toException("Board name must not exceed 255 characters");
        }
    }

    public void validateBoardId(Long boardId) {
        if (boardId == null) {
            throw ErrorCode.INVALID_REQUEST.toException("Board ID is required");
        }

        if (!boardRepository.existsById(boardId)) {
            throw ErrorCode.INVALID_REQUEST.toException("Board not found with ID: " + boardId);
        }
    }
}

