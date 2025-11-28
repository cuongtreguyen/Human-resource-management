package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmployeeListResponse {
    private List<EmployeeListItemDTO> data;
    private boolean success = true;
    private long total;
}

