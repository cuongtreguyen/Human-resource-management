package management.member.demo.normalizer;

import management.member.demo.normalizer.common.CommonMappingUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

/**
 * Normalizer cho Attendance Requests
 * 
 * Nhiệm vụ: Chuyển đổi tất cả input từ FE → format chuẩn của BE
 * 
 * Lưu ý:
 * - Chỉ làm nhiệm vụ convert/transform, KHÔNG validate business rules
 * - Log rõ ràng khi có field không hợp lệ để dễ debug
 * 
 * Mapping rules:
 * - employeeId (String) → employeeId (Long)
 * - date → attendanceDate
 * - checkInTime (String "HH:mm") → checkIn (LocalTime "HH:mm:ss")
 * - checkOutTime (String "HH:mm") → checkOut (LocalTime "HH:mm:ss")
 */
@Component
public class AttendanceRequestNormalizer {
    
    private final CommonMappingUtils commonMappingUtils;
    
    @Autowired
    public AttendanceRequestNormalizer(CommonMappingUtils commonMappingUtils) {
        this.commonMappingUtils = commonMappingUtils;
    }

    /**
     * Parse time string và convert sang LocalTime
     * Delegate to CommonMappingUtils
     * 
     * @param timeString Time string từ FE
     * @return LocalTime object
     */
    public LocalTime parseTime(String timeString) {
        return commonMappingUtils.parseTime(timeString);
    }
    
    /**
     * Parse employeeId từ String hoặc Long
     * Delegate to CommonMappingUtils
     * 
     * @param employeeId Employee ID từ FE (String hoặc Long)
     * @return Long employee ID
     */
    public Long parseEmployeeId(Object employeeId) {
        return commonMappingUtils.parseEmployeeId(employeeId);
    }
}

