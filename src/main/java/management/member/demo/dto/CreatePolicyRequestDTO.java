package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreatePolicyRequestDTO {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotNull(message = "Effective date is required")
    private LocalDate effectiveDate;
}

