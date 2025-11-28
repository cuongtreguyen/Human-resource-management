package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DocumentDTO {
    private String id;
    private String name;
    private String category;
    private String type;
    private String size;
    private String uploadedBy;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate uploadedDate;
    
    private String description;
    private String url;
    private String accessLevel;
    private Integer downloads;
    private String version;
}

