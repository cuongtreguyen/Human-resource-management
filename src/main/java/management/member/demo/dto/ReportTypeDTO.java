package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReportTypeDTO {
    private String id;
    private String name;
    private String description;
    private List<String> formats;
}

