package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WelfareProgramListResponseDTO {
    private List<WelfareProgramDTO> data;
    private boolean success;
}

