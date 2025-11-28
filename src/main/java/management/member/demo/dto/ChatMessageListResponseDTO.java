package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatMessageListResponseDTO {
    private List<ChatMessageDTO> data;
    private boolean success;
    private Long total;
    private Integer page;
    private Integer size;
    private Integer totalPages;
}

