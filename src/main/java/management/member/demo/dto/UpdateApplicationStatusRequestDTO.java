package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateApplicationStatusRequestDTO {
    private String status; // "interview", "offered", "rejected"
    private LocalDateTime interviewDate;
    private String notes;
}

