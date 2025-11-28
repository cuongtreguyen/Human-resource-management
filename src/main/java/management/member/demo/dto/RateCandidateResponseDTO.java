package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RateCandidateResponseDTO {
    private String id;
    private Integer rating;
    private String message;
    private boolean success;
}

