package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO cho thống kê attendance theo từng ngày trong tuần (7 ngày)
 * Chứa 3 số liệu: đúng giờ, trễ, vắng mặt
 */
@Getter
@Setter
public class WeeklyAttendanceStatisticsDTO {
    /** Danh sách thống kê theo từng ngày */
    private List<DailyAttendanceStatistics> dailyStatistics;

    /**
     * Nested class cho thống kê từng ngày
     */
    @Getter
    @Setter
    public static class DailyAttendanceStatistics {
        /** Ngày */
        private LocalDate date;
        
        /** Số nhân viên check in đúng giờ */
        private Long onTimeCount;
        
        /** Số nhân viên check in trễ */
        private Long lateCount;
        
        /** Số nhân viên vắng mặt */
        private Long absentCount;
    }
}

