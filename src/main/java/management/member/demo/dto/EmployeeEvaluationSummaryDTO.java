package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeEvaluationSummaryDTO {
    private String id;
    private String period;
    private Double overallRating;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate reviewDate;
    
    private String reviewer;
}

