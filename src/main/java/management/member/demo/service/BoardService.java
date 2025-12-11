package management.member.demo.service;

import management.member.demo.dto.AddMemberRequest;
import management.member.demo.dto.BoardRequest;
import management.member.demo.dto.BoardResponse;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.dto.UpdateBoardNameRequest;
import management.member.demo.mapper.EmployeeMapper;
import management.member.demo.entity.Board;
import management.member.demo.entity.Employee;
import management.member.demo.entity.User;
import management.member.demo.enums.BoardStatus;
import management.member.demo.enums.Role;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ForbiddenException;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.BoardMapper;
import management.member.demo.repository.BoardRepository;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.UserRepository;
import management.member.demo.validator.BoardValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger log = LoggerFactory.getLogger(BoardService.class);
    @Autowired
    BoardRepository boardRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BoardMapper boardMapper;

    @Autowired
    EmployeeMapper employeeMapper;

    @Autowired
    BoardValidator boardValidator;

    // Helper: Lấy User và Employee hiện tại
    private User getCurrentUser() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));
    }

    private Employee getCurrentEmployee() {
        User user = getCurrentUser();
        log.info("getCurrentEmployee - User ID: {}, Email: {}, employees_id FK: {}",
                user.getId(), user.getEmail(), user.getEmployeeId());

        Employee employee = user.getEmployee();
        if (employee == null) {
            log.error("User {} không có Employee liên kết!", user.getEmail());
            throw new ResourceNotFoundException(ErrorCode.USER_NOT_LINKED_TO_EMPLOYEE.getMessage());
        }
        log.info("getCurrentEmployee - Found Employee ID: {}, Name: {}", employee.getId(), employee.getFullName());
        return employee;
    }

    // Helper: Kiểm tra user có phải Manager/Admin không
    private boolean isManagerOrAdmin() {
        Role role = getCurrentUser().getRole();
        return role == Role.MANAGER || role == Role.ADMIN;
    }

    // 1. Tạo Board mới - CHỈ MANAGER/ADMIN
    public BoardResponse createBoard(BoardRequest request) {
        boardValidator.validateCreateBoardRequest(request);
        
        if (!isManagerOrAdmin()) {
            throw new ForbiddenException(ErrorCode.ACCESS_DENIED.getMessage());
        }
        Employee creator = getCurrentEmployee();

        Board board = new Board();
        board.setName(request.getName());
        board.setCreatedAt(LocalDate.now());
        board.setStatus(BoardStatus.ACTIVE);

        // Thêm người tạo vào làm thành viên đầu tiên
        List<Employee> members = new ArrayList<>();
        members.add(creator);
        board.setMembers(members);

        return boardMapper.toResponse(boardRepository.save(board));
    }

    // Thêm member vào board - CHỈ MANAGER/ADMIN
    public BoardResponse addMemberToBoard(AddMemberRequest request) {
        boardValidator.validateAddMemberRequest(request);
        
        if (!isManagerOrAdmin()) {
            throw new ForbiddenException(ErrorCode.ACCESS_DENIED.getMessage());
        }

        // Tìm Board theo boardId từ request
        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.BOARD_NOT_FOUND.getMessage()));

        // Tìm Nhân viên theo Email
        Employee newMember = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));

        // Khởi tạo danh sách members nếu null
        if (board.getMembers() == null) {
            board.setMembers(new ArrayList<>());
        }

        // Kiểm tra xem đã có trong board chưa
        boolean isAlreadyMember = board.getMembers().stream()
                .anyMatch(emp -> emp.getId().equals(newMember.getId()));

        if (!isAlreadyMember) {
            board.getMembers().add(newMember);
            board = boardRepository.save(board);
        } else {
            throw new ResourceNotFoundException(ErrorCode.BOARD_MEMBER_ALREADY_EXISTS.getMessage());
        }

        return boardMapper.toResponse(board);
    }

    // 2. Lấy danh sách Board - LỌC THEO ROLE
    public List<BoardResponse> getAllBoards(String search) {
        User currentUser = getCurrentUser();
        Employee currentEmployee = getCurrentEmployee();
        Role userRole = currentUser.getRole();
        Long currentEmployeeId = currentEmployee.getId();

        log.info("=== getAllBoards DEBUG ===");
        log.info("Current User: {} (Role: {})", currentUser.getEmail(), userRole);
        log.info("Current Employee ID: {}, Name: {}", currentEmployeeId, currentEmployee.getFullName());

        // Dùng JOIN FETCH để đảm bảo members được load từ DB
        List<Board> boards;
        if (search != null && !search.isEmpty()) {
            boards = boardRepository.findByNameContainingAndStatusWithMembers(search, BoardStatus.ACTIVE);
        } else {
            boards = boardRepository.findByStatusWithMembers(BoardStatus.ACTIVE);
        }

        log.info("Total boards from DB: {}", boards.size());
        for (Board b : boards) {
            List<Long> memberIds = b.getMembers() != null
                ? b.getMembers().stream().map(Employee::getId).collect(Collectors.toList())
                : List.of();
            log.info("Board [{}] '{}' - Members: {}", b.getId(), b.getName(), memberIds);
        }

        // Lọc boards - CHỈ trả về boards mà user là member
        List<BoardResponse> result = boards.stream()
                .filter(board -> {
                    if (board.getMembers() == null || board.getMembers().isEmpty()) {
                        log.info("Board [{}] - NO MEMBERS, skipping", board.getId());
                        return false;
                    }
                    // Kiểm tra user có trong danh sách members không
                    boolean isMember = board.getMembers().stream()
                            .anyMatch(emp -> emp.getId().equals(currentEmployeeId));
                    log.info("Board [{}] - isMember for Employee {}: {}", board.getId(), currentEmployeeId, isMember);
                    return isMember;
                })
                .map(boardMapper::toResponse)
                .collect(Collectors.toList());

        log.info("Filtered boards count: {}", result.size());
        return result;
    }

    // 3. Xóa Board - CHỈ MANAGER/ADMIN
    public void deleteBoard(Long id) {
        boardValidator.validateBoardId(id);
        
        if (!isManagerOrAdmin()) {
            throw new ForbiddenException(ErrorCode.ACCESS_DENIED.getMessage());
        }
        boardRepository.deleteById(id);
    }

    // Cập nhật board - CHỈ MANAGER/ADMIN
    public BoardResponse updateBoardName(Long boardId, UpdateBoardNameRequest request) {
        boardValidator.validateBoardId(boardId);
        boardValidator.validateUpdateBoardNameRequest(request);
        
        if (!isManagerOrAdmin()) {
            throw new ForbiddenException(ErrorCode.ACCESS_DENIED.getMessage());
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.BOARD_NOT_FOUND.getMessage()));

        board.setName(request.getName());

        return boardMapper.toResponse(boardRepository.save(board));
    }

    // Xóa member khỏi board - CHỈ MANAGER/ADMIN
    public void removeMemberFromBoard(Long boardId, Long memberId) {
        boardValidator.validateBoardId(boardId);
        
        if (!isManagerOrAdmin()) {
            throw new ForbiddenException(ErrorCode.ACCESS_DENIED.getMessage());
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.BOARD_NOT_FOUND.getMessage()));

        if (board.getMembers() == null || board.getMembers().isEmpty()) {
            throw new ResourceNotFoundException(ErrorCode.BOARD_NO_MEMBERS.getMessage());
        }

        boolean removed = board.getMembers().removeIf(emp -> emp.getId().equals(memberId));

        if (!removed) {
            throw new ResourceNotFoundException(ErrorCode.BOARD_MEMBER_NOT_FOUND.getMessage());
        }

        boardRepository.save(board);
    }

    public int getTotalBoards() {
        return (int) boardRepository.count();
    }

    // Lấy chi tiết board theo ID
    public BoardResponse getBoardById(Long boardId) {
        boardValidator.validateBoardId(boardId);
        
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.BOARD_NOT_FOUND.getMessage()));
        return boardMapper.toResponse(board);
    }

    public List<EmployeeResponse> getBoardMembers(Long boardId) {
        boardValidator.validateBoardId(boardId);
        
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.BOARD_NOT_FOUND.getMessage()));

        if (board.getMembers() == null) {
            return new ArrayList<>();
        }

        return board.getMembers().stream()
                .map(employeeMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Lấy tất cả boards mà nhân viên hiện tại là thành viên
    public List<BoardResponse> getMyBoards() {
        Employee currentEmployee = getCurrentEmployee();
        Long employeeId = currentEmployee.getId();
        
        log.info("getMyBoards - Employee ID: {}, Name: {}", employeeId, currentEmployee.getFullName());
        
        List<Board> boards = boardRepository.findByMemberIdAndStatus(employeeId, BoardStatus.ACTIVE);
        
        log.info("Found {} boards for employee {}", boards.size(), employeeId);
        
        return boards.stream()
                .map(boardMapper::toResponse)
                .collect(Collectors.toList());
    }
}