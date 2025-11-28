package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class ApplicationDetailDTO {
    private String id;
    private String positionId;
    private String positionTitle;
    private String candidateName;
    private String email;
    private String phone;
    private String experience;
    private String education;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appliedDate;
    
    private String resumeUrl;
    private String coverLetter;
    private Integer rating;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime interviewDate;
    
    private String notes;
}

