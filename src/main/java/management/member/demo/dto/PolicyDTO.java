package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PolicyDTO {
    private String id;
    private String name;
    private String description;
    private String type;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate effectiveDate;
}

