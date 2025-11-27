package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO để nhận response từ Flask API cho attendance
 * Flask trả về format: {id, name, date, check_in, check_out}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceFlaskResponseDTO {
    @JsonProperty("id")
    private String id; // Employee ID từ Flask (String)
    
    @JsonProperty("name")
    private String name; // Employee name
    
    @JsonProperty("date")
    private String date; // Format: "YYYY-MM-DD"
    
    @JsonProperty("check_in")
    private String checkIn; // Format: "HH:MM:SS" hoặc null
    
    @JsonProperty("check_out")
    private String checkOut; // Format: "HH:MM:SS" hoặc null
}

