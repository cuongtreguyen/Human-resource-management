package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TicketListResponseDTO {
    private List<TicketListItemDTO> data;
    private boolean success;
}

