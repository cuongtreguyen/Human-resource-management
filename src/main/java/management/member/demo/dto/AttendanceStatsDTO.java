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
    
    @JsonProperty("presentToday")
    private Integer presentToday; // Flask yêu cầu "presentToday" thay vì "present"
    
    @JsonProperty("absentToday")
    private Integer absentToday; // Flask yêu cầu "absentToday" thay vì "absent"
    
    @JsonProperty("lateToday")
    private Integer lateToday; // Flask yêu cầu field này
    
    // Giữ lại các field cũ để tương thích với code hiện tại
    private Integer checkedOut;
    private Integer stillWorking;
    
    // Constructor để tương thích với code cũ
    public AttendanceStatsDTO(Integer totalEmployees, Integer present, Integer absent, Integer checkedOut, Integer stillWorking) {
        this.totalEmployees = totalEmployees;
        this.presentToday = present;
        this.absentToday = absent;
        this.checkedOut = checkedOut;
        this.stillWorking = stillWorking;
        this.lateToday = 0; // Default value
    }
}

