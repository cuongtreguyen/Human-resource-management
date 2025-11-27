package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private Long id;
    private Long employeeId; // ID của Employee
    private String employeeName; // Tên Employee
    private String userId; // Giữ lại để tương thích
    private String userName; // Giữ lại để tương thích
    private LocalDate attendanceDate;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
