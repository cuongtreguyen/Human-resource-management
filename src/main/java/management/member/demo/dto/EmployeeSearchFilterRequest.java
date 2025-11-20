package management.member.demo.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
@Getter
@Setter
@Builder
public class EmployeeSearchFilterRequest {
    // Phòng ban
    private String department;
    
    // Chức vụ
    private String position;
    
    // Lấy tất cả chức vụ (nếu true thì bỏ qua filter position)
    private Boolean allPositions;
    
    // Mức lương tối thiểu
    private BigDecimal minSalary;
    
    // Mức lương tối đa
    private BigDecimal maxSalary;
}

