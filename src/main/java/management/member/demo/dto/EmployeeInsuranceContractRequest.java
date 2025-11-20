package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Data
@Getter
@Setter
@Builder
public class EmployeeInsuranceContractRequest {
    @NotNull(message = "ID nhân viên không được để trống")
    private Long employeeId;

    @NotBlank(message = "Số hợp đồng không được để trống")
    private String contractNumber;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate endDate;

    @NotBlank(message = "Mức độ bao phủ không được để trống")
    private String coverage;

    private String description;
}
