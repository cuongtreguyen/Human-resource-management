package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InsurancePolicyListResponseDTO {
    private List<InsurancePolicyDTO> data;
    private boolean success;
}

