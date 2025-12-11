package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class S3DeleteResponseDTO {
    private String status;
    private String message;
    private String fileUrl;
}

