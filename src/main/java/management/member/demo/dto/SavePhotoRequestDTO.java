package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavePhotoRequestDTO {
    @NotBlank(message = "User ID is required")
    private String userId;
    
    private String userName;
    
    private Integer photoNumber;
    
    @NotBlank(message = "Image data is required")
    private String imageData; // Base64 encoded image
}

