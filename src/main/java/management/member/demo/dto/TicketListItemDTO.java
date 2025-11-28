package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TicketListItemDTO {
    private String id;
    private String subject;
    private String category;
    private String priority;
    private String status;
    private String description;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdDate;
    
    private String employeeId;
    private String employeeName;
    private String assignedTo;
    private String response;
}

