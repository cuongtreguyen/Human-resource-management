package management.member.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SettingsResponseDTO {
    private CompanySettingsDTO company;
    private WorkingHoursSettingsDTO workingHours;
    private PayrollSettingsDTO payroll;
    private LeaveSettingsDTO leave;
    private boolean success;
    
    @Getter
    @Setter
    public static class CompanySettingsDTO {
        private String name;
        private String address;
        private String phone;
        private String email;
        private String website;
        private String taxCode;
    }
    
    @Getter
    @Setter
    public static class WorkingHoursSettingsDTO {
        private String startTime;
        private String endTime;
        private String lunchBreak;
        private java.util.List<String> workingDays;
    }
    
    @Getter
    @Setter
    public static class PayrollSettingsDTO {
        private String currency;
        private Integer paymentDay;
        private Double socialInsurance;
        private Double healthInsurance;
        private Double unemploymentInsurance;
        private Double overtimeRate;
    }
    
    @Getter
    @Setter
    public static class LeaveSettingsDTO {
        private Integer annualLeave;
        private Integer sickLeave;
        private Integer maternityLeave;
        private Boolean carryForward;
        private Integer maxCarryForward;
    }
}

