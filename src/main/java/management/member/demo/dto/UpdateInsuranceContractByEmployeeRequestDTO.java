package management.member.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * DTO cho request update Insurance Contract by Employee
 */
@Getter
@Setter
public class UpdateInsuranceContractByEmployeeRequestDTO {
    @NotNull(message = "Contract ID không được để trống")
    private Long contractId;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate effective;
    
    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate expiry;
    
    private LocalDate grantDate;
}

