package management.member.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateEvaluationRequestDTO {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
    
    @NotBlank(message = "Period is required")
    private String period;
    
    @NotNull(message = "Review date is required")
    private LocalDate reviewDate;
    
    @NotNull(message = "Work performance is required")
    @Min(value = 1, message = "Work performance must be between 1 and 5")
    @Max(value = 5, message = "Work performance must be between 1 and 5")
    private Integer workPerformance;
    
    @NotNull(message = "Teamwork is required")
    @Min(value = 1, message = "Teamwork must be between 1 and 5")
    @Max(value = 5, message = "Teamwork must be between 1 and 5")
    private Integer teamwork;
    
    @NotNull(message = "Attitude is required")
    @Min(value = 1, message = "Attitude must be between 1 and 5")
    @Max(value = 5, message = "Attitude must be between 1 and 5")
    private Integer attitude;
    
    private String strengths;
    private String improvements;
    private String comments;
    
    @NotBlank(message = "Reviewer is required")
    private String reviewer;
    
    @NotBlank(message = "Reviewer role is required")
    private String reviewerRole;
}

