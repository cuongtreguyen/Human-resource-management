package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class S3UploadResponseDTO {
    private String status;
    private String message;
    private String fileUrl;
    private String originalFilename;
    private Long size;
    private String contentType;
    private String folder;
}

