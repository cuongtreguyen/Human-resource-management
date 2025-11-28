package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EvaluationListItemDTO {
    private String id;
    private String employeeId;
    private String employeeName;
    private String department;
    private String period;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate reviewDate;
    
    private Integer workPerformance;
    private Integer teamwork;
    private Integer attitude;
    private Double overallRating;
    private String strengths;
    private String improvements;
    private String reviewer;
    private String reviewerRole;
}

