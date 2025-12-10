package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeListItemDTO {
    // 1. Các trường hiển thị trên UI
    private Long numericId;     // DB ID (Long) - dùng cho Kanban assignee
    private String id;          // Mã nhân viên (VD: EMP001) - dùng cho nút con mắt
    private String name;        // Cột "TÊN NHÂN VIÊN"
    private String email;       // Dòng dưới tên nhân viên
    private String department;  // Cột "PHÒNG BAN"
    private String position;    // Cột "CHỨC VỤ"
    private LocalDate hireDate; // Cột "NGÀY BẮT ĐẦU" (FE sẽ tự tính thâm niên từ ngày này)
    private String seniority;
    private String status;      // Cột "TRẠNG THÁI"
}

