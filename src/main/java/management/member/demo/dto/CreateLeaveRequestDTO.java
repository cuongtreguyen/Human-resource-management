package management.member.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreateLeaveRequestDTO {
    @NotBlank(message = "Vui lòng cung cấp ID nhân viên")
    private String employeeId;

    // Dropdown "Loại nghỉ phép"
    @NotBlank(message = "Vui lòng chọn loại nghỉ phép")
    private String type;

    // Datepicker "Ngày bắt đầu"
    @NotNull(message = "Vui lòng chọn ngày bắt đầu")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    // Datepicker "Ngày kết thúc"
    @NotNull(message = "Vui lòng chọn ngày kết thúc")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    // Textarea "Lý do nghỉ phép"
    private String reason;
}