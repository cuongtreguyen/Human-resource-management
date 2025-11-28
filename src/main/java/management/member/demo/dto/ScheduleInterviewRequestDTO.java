package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ScheduleInterviewRequestDTO {
    @NotNull(message = "Interview date is required")
    private LocalDate interviewDate;
    
    @NotBlank(message = "Interview time is required")
    private String interviewTime; // "14:00"
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Interviewers are required")
    private List<String> interviewers; // List of user IDs
}

