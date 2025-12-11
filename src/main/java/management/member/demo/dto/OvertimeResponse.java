package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OvertimeResponse {
    private Long id;
    private String employeeId;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate otDate;
    private Double otHours;
    private Long boardId;
    private String boardName;
    private String reason;
    private OverTimeStatus overtimeStatus;
    private String managerNote;
    private LocalDateTime createdAt;
    private String approvedBy;
    private String department;
}

