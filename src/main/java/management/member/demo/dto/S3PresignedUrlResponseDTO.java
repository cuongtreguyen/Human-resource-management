package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class S3PresignedUrlResponseDTO {
    private String status;
    private String originalUrl;
    private String presignedUrl;
    private Integer expirationMinutes;
    private String message;
}

