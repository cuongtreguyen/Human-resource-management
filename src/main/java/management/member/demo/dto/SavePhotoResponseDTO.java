package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavePhotoResponseDTO {
    private String status; // "success" | "error"
    private String message;
    private String filepath; // Optional
}

