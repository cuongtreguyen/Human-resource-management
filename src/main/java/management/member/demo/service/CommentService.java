package management.member.demo.service;

import management.member.demo.dto.CommentRequest;
import management.member.demo.dto.CommentResponse;
import management.member.demo.entity.Comment;
import management.member.demo.entity.Employee;
import management.member.demo.entity.Task;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.CommentMapper;
import management.member.demo.repository.CommentRepository;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.TaskRepository;
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
    @Autowired
    CommentRepository commentRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    TaskRepository taskRepository;


    @Autowired
    private CommentMapper commentMapper;

    public CommentResponse createComment(CommentRequest request){
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
}
