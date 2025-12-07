package management.member.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.enums.AttendenceStatus;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceFilterResponseDTO {
    private String employeeID; // Định dạng: emp***
    private String fullName;
    private String department;
    private String shift; // Có thể null nếu không có trong database
    private LocalTime timeIn; // checkIn
    private LocalTime timeOut; // checkOut
    private AttendenceStatus status;
}

