package management.member.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.InsuranceContractStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO cho request update Insurance Contract (template contract)
 */
@Getter
@Setter
public class UpdateInsuranceContractRequestDTO {
    @NotBlank(message = "Tên bảo hiểm không được để trống")
    private String insurenceName;
    
    @NotNull(message = "Tỷ lệ công ty đóng không được để trống")
    private BigDecimal employerRate;
    
    @NotNull(message = "Tỷ lệ nhân viên đóng không được để trống")
    private BigDecimal employeeRate;
    
    private String provider;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate effective;
    
    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate expiry;
    
    @NotNull(message = "Trạng thái không được để trống")
    private InsuranceContractStatus status;
}

