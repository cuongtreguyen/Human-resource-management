package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class UpdateSettingsRequestDTO {
    private String section; // "company", "workingHours", "payroll", "leave"
    private Map<String, Object> data;
}

