package management.member.demo.mapper;

import management.member.demo.dto.CommentResponse;
import management.member.demo.entity.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {
    public CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(comment.getAuthor() != null ? comment.getAuthor().getFullName(): "Unknown")
                .createdAt(comment.getCreatedAt())
                .build();
    }
}