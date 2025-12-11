package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO cho filter options (phòng ban và tháng)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterOptionsDTO {
    private List<String> selectedDepartment;
    private List<String> selectedMonth;
}

