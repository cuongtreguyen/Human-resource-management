package management.member.demo.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WeeklyAttendancePercentageDTO {
    List<DailyAttendancePercentage> dailyPercentages; // Phần trăm chấm công theo từng ngày trong tuần
    
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class DailyAttendancePercentage {
        String dayOfWeek; // "Monday", "Tuesday", ..., "Sunday"
        java.time.LocalDate date; // Ngày cụ thể
        Double presentPercentage; // Phần trăm có mặt (0-100)
        Double absentPercentage; // Phần trăm vắng mặt (0-100)
    }
}

