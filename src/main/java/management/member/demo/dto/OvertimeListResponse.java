package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.enums.OverTimeStatus;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OvertimeListResponse {
    private Long id;
    private String employeeName;
    private String department;
    private String title; // Task title
    private LocalDate deadline; // Task deadline
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate otDate;
    
    private Double otHours;
    private OverTimeStatus overtimeStatus;
}

