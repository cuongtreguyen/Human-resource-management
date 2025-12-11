package management.member.demo.service;

import management.member.demo.dto.CommentRequest;
import management.member.demo.dto.CommentResponse;
import management.member.demo.dto.CommentUpdateRequest;
import management.member.demo.entity.Comment;
import management.member.demo.entity.Employee;
import management.member.demo.entity.KanbanCard;
import management.member.demo.entity.Task;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.CommentMapper;
import management.member.demo.validator.CommentValidator;
import management.member.demo.repository.CommentRepository;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.KanbanCardRepository;
import management.member.demo.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {
    private static final Logger log = LoggerFactory.getLogger(CommentService.class);
    @Autowired
    CommentRepository commentRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    KanbanCardRepository cardRepository;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private CommentValidator commentValidator;

    public CommentResponse createComment(CommentRequest request){
        // Validate request
        commentValidator.validateCommentRequest(request);
        
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.TASK_NOT_FOUND.getMessage()));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName(); // Lấy email/username từ token

        // 3. Tìm Employee dựa trên Email vừa lấy được
        Employee author = employeeRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .task(task)
                .author(author)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toResponse(savedComment);
    }

    public List<CommentResponse> getCommentsByTaskID(Long taskId) {
        // 1. Kiểm tra Task có tồn tại không
        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException(ErrorCode.TASK_NOT_FOUND.getMessage());
        }

        // 2. Lấy danh sách comment
        List<Comment> comments = commentRepository.findByTaskId(taskId);

        // 3. Map sang DTO và trả về List
        return comments.stream()
                .map(comment -> commentMapper.toResponse(comment))
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật comment
     * Chỉ nhân viên đã tạo comment mới có quyền cập nhật
     */
    public CommentResponse updateComment(Long commentId, CommentUpdateRequest request) {
        // 1. Tìm comment theo ID
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment không tồn tại với ID: " + commentId));

        // 2. Lấy thông tin nhân viên hiện tại
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Employee currentEmployee = employeeRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));

        // Validate update request
        commentValidator.validateCommentUpdateRequest(request);
        
        // 3. Kiểm tra quyền: chỉ author mới được cập nhật
        if (comment.getAuthor() == null || !comment.getAuthor().getId().equals(currentEmployee.getId())) {
            throw ErrorCode.ACCESS_DENIED.toException("Bạn không có quyền cập nhật comment này. Chỉ người đã tạo comment mới có quyền cập nhật.");
        }

        // 4. Cập nhật nội dung
        comment.setContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);

        return commentMapper.toResponse(updatedComment);
    }

    @Autowired
    private management.member.demo.repository.UserRepository userRepository;

    /**
     * Xóa comment
     * Chỉ nhân viên đã tạo comment mới có quyền xóa
     */
    public void deleteComment(Long commentId) {
        // Validate comment ID
        commentValidator.validateCommentId(commentId);
        
        // 1. Tìm comment theo ID
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment không tồn tại với ID: " + commentId));

        // 2. Lấy thông tin nhân viên hiện tại qua User (tránh lỗi email khác nhau)
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Employee currentEmployee = userRepository.findByEmail(currentEmail)
                .map(user -> user.getEmployee())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy User với email: " + currentEmail));

        if (currentEmployee == null) {
            throw new ResourceNotFoundException("User chưa được liên kết với Employee");
        }

        // 3. Kiểm tra quyền: chỉ author mới được xóa
        if (comment.getAuthor() == null || !comment.getAuthor().getId().equals(currentEmployee.getId())) {
            throw ErrorCode.ACCESS_DENIED.toException("Bạn không có quyền xóa comment này. Chỉ người đã tạo comment mới có quyền xóa.");
        }

        // 4. Xóa comment
        commentRepository.delete(comment);
    }

    // ============== KANBAN CARD COMMENTS ==============

    /**
     * Lấy danh sách comment của Kanban Card
     */
    public List<CommentResponse> getCommentsByCardId(Long cardId) {
        if (!cardRepository.existsById(cardId)) {
            throw new ResourceNotFoundException("Card không tồn tại với ID: " + cardId);
        }

        List<Comment> comments = commentRepository.findByCardIdOrderByCreatedAtDesc(cardId);

        return comments.stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tạo comment cho Kanban Card
     */
    public CommentResponse createCardComment(Long cardId, String content) {
        // Validate
        commentValidator.validateCardId(cardId);
        commentValidator.validateCardCommentContent(content);
        
        log.info("=== createCardComment START ===");
        log.info("CardId: {}, Content: {}", cardId, content);

        KanbanCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card không tồn tại với ID: " + cardId));
        log.info("Found card: {} - {}", card.getId(), card.getTitle());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        log.info("Current user email: {}", currentEmail);

        Employee author = employeeRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EMPLOYEE_NOT_FOUND.getMessage()));
        log.info("Found author: {} - {}", author.getId(), author.getFullName());

        Comment comment = Comment.builder()
                .content(content)
                .createdAt(LocalDateTime.now())
                .card(card)
                .author(author)
                .build();

        Comment savedComment = commentRepository.save(comment);
        log.info("Saved comment with ID: {}", savedComment.getId());

        // Update comment count on card
        int oldCount = card.getCommentCount();
        card.setCommentCount(oldCount + 1);
        cardRepository.save(card);
        log.info("Updated card comment count: {} -> {}", oldCount, oldCount + 1);

        CommentResponse response = commentMapper.toResponse(savedComment);
        log.info("=== createCardComment END - Response ID: {} ===", response.getId());
        return response;
    }
}
