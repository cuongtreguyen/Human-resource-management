package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VoluntaryInsuranceListResponseDTO {
    private List<VoluntaryInsuranceDTO> data;
    private boolean success;
}

