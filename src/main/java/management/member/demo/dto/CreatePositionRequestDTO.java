package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreatePositionRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotBlank(message = "Level is required")
    private String level;
    
    @NotBlank(message = "Salary is required")
    private String salary;
    
    @NotBlank(message = "Experience is required")
    private String experience;
    
    @NotNull(message = "Openings is required")
    private Integer openings;
    
    private String description;
    private List<String> requirements;
    
    @NotNull(message = "Closing date is required")
    private LocalDate closingDate;
}

