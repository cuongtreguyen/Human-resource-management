package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceStatsDTO {
    @JsonProperty("totalEmployees")
    private Integer totalEmployees;
    
    @JsonProperty("present")
    private Integer present;
    
    @JsonProperty("absent")
    private Integer absent;
    
    @JsonProperty("checkedOut")
    private Integer checkedOut;
    
    @JsonProperty("stillWorking")
    private Integer stillWorking;
    
    // Keep for backward compatibility
    @JsonProperty("presentToday")
    private Integer presentToday;
    
    @JsonProperty("absentToday")
    private Integer absentToday;
    
    @JsonProperty("lateToday")
    private Integer lateToday;
    
    // Constructor để tương thích với code cũ
    public AttendanceStatsDTO(Integer totalEmployees, Integer present, Integer absent, Integer checkedOut, Integer stillWorking) {
        this.totalEmployees = totalEmployees;
        this.present = present;
        this.presentToday = present; // For backward compatibility
        this.absent = absent;
        this.absentToday = absent; // For backward compatibility
        this.checkedOut = checkedOut;
        this.stillWorking = stillWorking;
        this.lateToday = 0; // Default value
    }
}

