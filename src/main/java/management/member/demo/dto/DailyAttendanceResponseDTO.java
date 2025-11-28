package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class DailyAttendanceResponseDTO {
    private String id;  // Attendance ID (String format)
    private String employeeId;  // Employee ID (String: employeeId or employeeCode)
    private String employeeName;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime checkIn;  // Format: "HH:mm"
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime checkOut;  // Format: "HH:mm"
    
    private String status;  // "present", "absent", "late", etc.
    private Double hoursWorked;  // Total hours worked
    private Double overtime;  // Overtime hours
}

