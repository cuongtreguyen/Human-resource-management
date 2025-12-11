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
public class OvertimeResponse {
    private Long id;
    private String employeeId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate otDate;

    private Double otHours;
    private Long taskId;
    private String reason;
    private String department;
    private OverTimeStatus overtimeStatus;
    private String managerNote;
}

