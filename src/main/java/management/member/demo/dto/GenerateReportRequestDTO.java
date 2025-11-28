package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class GenerateReportRequestDTO {
    @NotBlank(message = "Report type is required")
    private String type; // "employee_summary", "attendance_summary", etc.
    
    @NotBlank(message = "Format is required")
    private String format; // "pdf", "excel"
    
    private Map<String, Object> parameters; // Optional parameters
}

