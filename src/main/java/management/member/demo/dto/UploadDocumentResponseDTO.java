package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadDocumentResponseDTO {
    private String id;
    private String name;
    private String message;
    private boolean success;
}

