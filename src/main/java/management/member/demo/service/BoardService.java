package management.member.demo.service;

import management.member.demo.dto.AddMemberRequest;
import management.member.demo.dto.BoardRequest;
import management.member.demo.dto.BoardResponse;
import management.member.demo.dto.UpdateBoardStatusRequest;
import management.member.demo.entity.Board;
import management.member.demo.entity.Employee;
import management.member.demo.enums.BoardStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.BoardMapper;
import management.member.demo.repository.BoardRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BoardService {
    @Autowired
    BoardRepository boardRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    BoardMapper boardMapper;

    // 1. Tạo Board mới
    public BoardResponse createBoard(BoardRequest request) {
        // Lấy email người đang đăng nhập từ Token
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        // Tìm thông tin Employee của người tạo
        Employee creator = employeeRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));

        Board board = new Board();
        board.setName(request.getName());
        board.setCreatedAt(LocalDate.now());
        board.setStatus(BoardStatus.ACTIVE); // Mặc định Active

        // QUAN TRỌNG: Khởi tạo danh sách và thêm người tạo vào làm thành viên đầu tiên
        List<Employee> members = new ArrayList<>();
        members.add(creator);
        board.setMembers(members);

        return boardMapper.toResponse(boardRepository.save(board));
    }

    public BoardResponse addMemberToBoard(Long boardId, AddMemberRequest request) {
        // Tìm Board
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board không tồn tại"));

        // Tìm Nhân viên theo Email
        Employee newMember = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với email: " + request.getEmail()));

        // Kiểm tra xem đã có trong board chưa để tránh trùng lặp
        boolean isAlreadyMember = board.getMembers().stream()
                .anyMatch(emp -> emp.getId().equals(newMember.getId()));

        if (!isAlreadyMember) {
            board.getMembers().add(newMember);
            board = boardRepository.save(board);
        } else {
            // Có thể throw lỗi hoặc chỉ đơn giản là return board cũ nếu muốn
            throw new IllegalArgumentException("Nhân viên này đã là thành viên của Board");
        }

        return boardMapper.toResponse(board);
    }

    // 2. Lấy danh sách Board (có hỗ trợ tìm kiếm)
    public List<BoardResponse> getAllBoards(String search) {
        List<Board> boards;

        if (search != null && !search.isEmpty()) {
            // Tìm kiếm nhưng chỉ trong các board ACTIVE
            boards = boardRepository.findByNameContainingIgnoreCaseAndStatus(search, BoardStatus.ACTIVE);
        } else {
            // Lấy tất cả board ACTIVE
            boards = boardRepository.findByStatus(BoardStatus.ACTIVE);
        }

        return boards.stream()
                .map(boardMapper::toResponse)
                .collect(Collectors.toList());
    }

    // 3. Xóa Board
    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }

    public BoardResponse updateBoardStatus(Long boardId, UpdateBoardStatusRequest request) {
        // 1. Tìm Board
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board không tồn tại"));

        // 2. Validate và Convert Enum
        try {
            // Chuyển chuỗi sang Enum (tự động uppercase để tránh lỗi active vs ACTIVE)
            BoardStatus newStatus = BoardStatus.valueOf(request.getStatus().trim().toUpperCase());
            board.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ. Các giá trị cho phép: ACTIVE, ARCHIVED, COMPLETED");
        }

        // 3. Lưu và trả về
        return boardMapper.toResponse(boardRepository.save(board));
    }
}