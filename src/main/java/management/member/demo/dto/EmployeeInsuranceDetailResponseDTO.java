package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmployeeInsuranceDetailResponseDTO {
    private List<InsuranceDetailItemDTO> data;
    private boolean success;
    
    @Getter
    @Setter
    public static class InsuranceDetailItemDTO {
        private String type; // "BHXH", "BHYT"
        private String start;
        private String end;
        private Integer dependents;
        private String hospitalName; // For BHYT
    }
}

