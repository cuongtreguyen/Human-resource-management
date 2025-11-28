package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatContactListResponseDTO {
    private List<ChatContactDTO> data;
    private boolean success;
}

