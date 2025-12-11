package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO cho thống kê task theo status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatisticsDTO {
    private Map<String, Long> statistics;
}

