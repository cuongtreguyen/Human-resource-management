package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreateLeaveRequestDTO {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
    
    @NotBlank(message = "Leave type is required")
    private String type; // "annual", "sick", "unpaid", "special"
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    private Integer days; // Optional, will be calculated if not provided
    
    private String reason;
    private String emergencyContact;
    private List<String> tasks; // Optional task IDs
    private String delegateTo; // Optional employee ID to delegate tasks to
}

