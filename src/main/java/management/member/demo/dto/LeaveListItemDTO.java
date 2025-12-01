package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class LeaveListItemDTO {
    private String id; // Leave ID as string
    private String employeeId; // Employee ID (String)
    private String employeeName;
    private String type; // "annual", "sick", "unpaid", "special"
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    
    private Integer days; // Number of days
    private String reason;
    private String status; // "pending", "approved", "rejected", "cancelled"
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate submittedDate;
    
    private String approvedBy; // Can be null
    private String department; // Department name
}

