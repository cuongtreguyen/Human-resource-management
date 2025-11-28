package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PayrollListResponseDTO {
    private List<PayrollListItemDTO> data;
    private boolean success;
}

