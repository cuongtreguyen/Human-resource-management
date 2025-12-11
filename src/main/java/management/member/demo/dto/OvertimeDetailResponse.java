package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.enums.OverTimeStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OvertimeDetailResponse {
    private Long id;
    private String employeeName;
    private String department;
    private String title; // Task title
    private LocalDate deadline; // Task deadline

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate otDate;

    private Double otHours;
    private String reason;
    private OverTimeStatus overtimeStatus;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}

