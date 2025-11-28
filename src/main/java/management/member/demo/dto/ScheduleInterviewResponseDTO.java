package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ScheduleInterviewResponseDTO {
    private String id;
    private LocalDate interviewDate;
    private String interviewTime;
    private String message;
    private boolean success;
}

