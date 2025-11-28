package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TrainingItemDTO {
    private String id;
    private String title;
    private String provider;
    private String type; // "online", "offline", "workshop"
    private String status; // "completed", "in-progress", "registered"
    private Integer progress;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    
    private Long cost;
    private Boolean certificate;
}

