package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmployeeBenefitsDetailResponseDTO {
    private List<BenefitItemDTO> benefits;
    private List<InsuranceDetailDTO> mandatoryInsurance;
    private List<InsuranceDetailDTO> voluntaryInsurance;
    private Integer totalBenefitValue;
    private boolean success;
    
    @Getter
    @Setter
    public static class BenefitItemDTO {
        private String id;
        private String name;
        private String amount;
        private Integer monthlyValue;
        private String status;
    }
    
    @Getter
    @Setter
    public static class InsuranceDetailDTO {
        private String id;
        private String name;
        private String provider;
        private String startDate;
        private String endDate;
        private String employerPays;
        private String employeePays;
        private String status;
    }
}

