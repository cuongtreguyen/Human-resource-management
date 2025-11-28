package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreateDelegationRequestDTO {
    @NotBlank(message = "From employee ID is required")
    private String fromEmployeeId;
    
    @NotBlank(message = "To employee ID is required")
    private String toEmployeeId;
    
    @NotNull(message = "Task IDs are required")
    private List<String> taskIds;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    private String reason;
}

