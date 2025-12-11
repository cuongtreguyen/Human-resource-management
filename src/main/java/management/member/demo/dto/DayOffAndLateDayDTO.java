package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho số ngày nghỉ và số ngày đi muộn của nhân viên
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DayOffAndLateDayDTO {
    private String dayOff;
    private String lateDay;
}

