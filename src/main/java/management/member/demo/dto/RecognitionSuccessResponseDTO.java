package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecognitionSuccessResponseDTO {
    private Boolean success;
    
    @JsonProperty("message")
    private String message; // Optional - Flask yêu cầu field "message" thay vì "error"
    
    // Thêm các field để trả về thông tin chi tiết hơn
    @JsonProperty("employeeId")
    private String employeeId; // Employee ID đã nhận diện
    
    @JsonProperty("employeeName")
    private String employeeName; // Tên employee
    
    @JsonProperty("attendanceId")
    private Long attendanceId; // ID của attendance record đã tạo (nếu có)
    
    @JsonProperty("checkInTime")
    private String checkInTime; // Thời gian check-in (nếu có)
    
    @JsonProperty("checkOutTime")
    private String checkOutTime; // Thời gian check-out (nếu có)
    
    @JsonProperty("status")
    private String status; // "checked_in" hoặc "checked_out"
    
    @JsonProperty("timestamp")
    private String timestamp; // Timestamp của recognition
    
    // Constructor để tương thích với code cũ
    public RecognitionSuccessResponseDTO(Boolean success, String error) {
        this.success = success;
        this.message = error; // Map error thành message
    }
    
    // Constructor với thông tin đầy đủ
    public RecognitionSuccessResponseDTO(Boolean success, String message, String employeeId, String employeeName) {
        this.success = success;
        this.message = message;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
    }
}

