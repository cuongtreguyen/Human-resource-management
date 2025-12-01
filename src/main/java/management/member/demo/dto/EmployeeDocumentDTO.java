package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeDocumentDTO {
    private String id;
    private String name;
    private String category;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate uploadedDate;
    
    private String size;
    private String url;
}

