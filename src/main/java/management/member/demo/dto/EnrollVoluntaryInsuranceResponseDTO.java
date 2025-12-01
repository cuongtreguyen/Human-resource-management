package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollVoluntaryInsuranceResponseDTO {
    private EnrollData data;
    private boolean success;
    private String message;
    
    @Getter
    @Setter
    public static class EnrollData {
        private String employeeId;
        private String insuranceId;
        private String status;
        private String startDate;
    }
}

