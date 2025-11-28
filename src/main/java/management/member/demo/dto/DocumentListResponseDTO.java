package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DocumentListResponseDTO {
    private List<DocumentDTO> data;
    private boolean success;
}

