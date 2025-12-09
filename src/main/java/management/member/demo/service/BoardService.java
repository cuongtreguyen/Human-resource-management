package management.member.demo.service;

import management.member.demo.dto.AddMemberRequest;
import management.member.demo.dto.BoardRequest;
import management.member.demo.dto.BoardResponse;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.UpdateBoardNameRequest;
import management.member.demo.mapper.EmployeeMapper;
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

    @Autowired
    EmployeeMapper employeeMapper;

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

    public BoardResponse addMemberToBoard(AddMemberRequest request) {
        // Lấy email người đang đăng nhập từ Token
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Tìm thông tin Employee của người đang đăng nhập
        Employee currentUser = employeeRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));

        // Tìm Board mà user hiện tại là member (lấy board đầu tiên)
        List<Board> userBoards = boardRepository.findByStatus(BoardStatus.ACTIVE).stream()
                .filter(board -> board.getMembers() != null && 
                        board.getMembers().stream()
                                .anyMatch(emp -> emp.getId().equals(currentUser.getId())))
                .collect(Collectors.toList());

        if (userBoards.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy Board mà bạn là thành viên");
        }

        // Lấy board đầu tiên
        Board board = userBoards.get(0);

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

    public BoardResponse updateBoardName(Long boardId, UpdateBoardNameRequest request) {
        // 1. Tìm Board
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board không tồn tại"));

        // 2. Cập nhật tên board
        board.setName(request.getName());

        // 3. Lưu và trả về
        return boardMapper.toResponse(boardRepository.save(board));
    }

    public int getTotalBoards() {
        return (int) boardRepository.count();
    }

    public List<EmployeeResponse> getBoardMembers(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board không tồn tại"));

        if (board.getMembers() == null) {
            return new ArrayList<>();
        }

        return board.getMembers().stream()
                .map(employeeMapper::toResponse)
                .collect(Collectors.toList());
    }
}