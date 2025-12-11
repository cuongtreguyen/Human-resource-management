package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OvertimeHistoryResponseDTO {
    private Long id;
    private String employeeId;
    private String employeeFullName;
    private Double otHours;
    private String reason;
    private String boardName;
    private OverTimeStatus overtimeStatus;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate otDate;
    private String department;
}

