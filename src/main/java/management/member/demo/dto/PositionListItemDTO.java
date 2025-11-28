package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PositionListItemDTO {
    private String id;
    private String title;
    private String department;
    private String location;
    private String type;
    private String level;
    private String salary;
    private String experience;
    private Integer openings;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate postedDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate closingDate;
    
    private Integer applicationsCount;
}

