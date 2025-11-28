package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ApplicationListItemDTO {
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
}

