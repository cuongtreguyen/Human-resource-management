package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExportResponseDTO {
    private String url;
    private String filename;
    private String message;
    private boolean success;
}

