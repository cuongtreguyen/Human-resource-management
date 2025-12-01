package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateDocumentRequestDTO {
    private String name;
    private String description;
    private String category;
    private String accessLevel;
}

