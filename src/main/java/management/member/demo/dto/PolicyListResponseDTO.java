package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PolicyListResponseDTO {
    private List<PolicyDTO> data;
    private boolean success;
}

