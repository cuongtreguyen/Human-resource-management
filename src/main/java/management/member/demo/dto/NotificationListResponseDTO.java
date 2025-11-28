package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NotificationListResponseDTO {
    private List<NotificationDTO> data;
    private boolean success;
}

