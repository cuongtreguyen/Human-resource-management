package management.member.demo.mapper;

import management.member.demo.dto.*;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.entity.EmployeeInsuranceContract;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

/**
 * Mapper class - Chỉ chịu trách nhiệm mapping giữa Entity và DTO cho Benefits
 */
@Component
public class BenefitsMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public BenefitDTO toBenefitDTO(EmployeeBenefits benefit) {
        BenefitDTO dto = new BenefitDTO();
        dto.setId(benefit.getBenefitId());
        dto.setName(benefit.getName());
        dto.setNameLatin(benefit.getName()); // TODO: Add nameLatin field to entity
        dto.setType("insurance");
        dto.setDescription(benefit.getDescription());
        dto.setCoverage(benefit.getCoverage());
        dto.setEligibility("Tất cả nhân viên chính thức");
        dto.setCost(benefit.getMonthlyCost());
        dto.setStatus(benefit.getStatus());
        dto.setEnrolledCount(0); // TODO: Calculate from database
        return dto;
    }

    public EmployeeBenefitsDetailResponseDTO.BenefitItemDTO toBenefitItemDTO(EmployeeBenefits benefit) {
        EmployeeBenefitsDetailResponseDTO.BenefitItemDTO dto = new EmployeeBenefitsDetailResponseDTO.BenefitItemDTO();
        dto.setId(benefit.getBenefitId());
        dto.setName(benefit.getName());
        dto.setAmount(benefit.getMonthlyCost());
        dto.setMonthlyValue(parseMonthlyValue(benefit.getMonthlyCost()));
        dto.setStatus(benefit.getStatus());
        return dto;
    }

    public EmployeeBenefitsDetailResponseDTO.InsuranceDetailDTO toInsuranceDetailDTO(EmployeeInsuranceContract contract) {
        EmployeeBenefitsDetailResponseDTO.InsuranceDetailDTO dto = new EmployeeBenefitsDetailResponseDTO.InsuranceDetailDTO();
        dto.setId(String.valueOf(contract.getId()));
        dto.setName(contract.getCoverage());
        dto.setProvider("Bảo hiểm xã hội Việt Nam");
        dto.setStartDate(contract.getStartDate() != null ? contract.getStartDate().format(DATE_FORMATTER) : null);
        dto.setEndDate(contract.getEndDate() != null ? contract.getEndDate().format(DATE_FORMATTER) : null);
        dto.setEmployerPays("17.5%");
        dto.setEmployeePays("8%");
        dto.setStatus("active");
        return dto;
    }

    public WelfareProgramDTO toWelfareProgramDTO(EmployeeBenefits benefit) {
        WelfareProgramDTO dto = new WelfareProgramDTO();
        dto.setId(benefit.getBenefitId());
        dto.setName(benefit.getName());
        dto.setAmount(benefit.getMonthlyCost());
        dto.setMonthlyValue(parseMonthlyValue(benefit.getMonthlyCost()));
        dto.setBudget(0); // TODO: Get from database
        dto.setParticipants(0); // TODO: Calculate from database
        dto.setOwner("Phòng Hành chính");
        dto.setStatus(benefit.getStatus());
        dto.setDescription(benefit.getDescription());
        dto.setEligibility("Tất cả nhân viên chính thức");
        return dto;
    }

    public InsurancePolicyDTO toInsurancePolicyDTO(EmployeeInsuranceContract contract) {
        InsurancePolicyDTO dto = new InsurancePolicyDTO();
        dto.setId("BHXH-2024");
        dto.setName("Bảo hiểm xã hội (BHXH)");
        dto.setProvider("Bảo hiểm xã hội Việt Nam");
        dto.setEmployerRate("17.5%");
        dto.setEmployeeRate("8%");
        dto.setEffective(contract.getStartDate() != null ? contract.getStartDate().format(DATE_FORMATTER) : "01/01/2024");
        dto.setExpiry(contract.getEndDate() != null ? contract.getEndDate().format(DATE_FORMATTER) : "31/12/2024");
        dto.setType("mandatory");
        dto.setDescription("Bảo hiểm xã hội bắt buộc theo quy định nhà nước");
        return dto;
    }

    public VoluntaryInsuranceDTO toVoluntaryInsuranceDTO(EmployeeInsuranceContract contract) {
        VoluntaryInsuranceDTO dto = new VoluntaryInsuranceDTO();
        dto.setId(String.valueOf(contract.getId()));
        dto.setName("Bảo hiểm sức khỏe cao cấp");
        dto.setProvider("Bảo Việt");
        dto.setMonthlyPremium(500000);
        dto.setCoverage("Khám chữa bệnh tại bệnh viện quốc tế");
        dto.setMaxBenefit("500.000.000 VNĐ/năm");
        dto.setStatus("available");
        dto.setDescription("Bảo hiểm sức khỏe cao cấp với quyền lợi khám chữa bệnh tại các bệnh viện quốc tế");
        return dto;
    }

    public EmployeeInsuranceDetailResponseDTO.InsuranceDetailItemDTO toInsuranceDetailItemDTO(EmployeeInsuranceContract contract) {
        EmployeeInsuranceDetailResponseDTO.InsuranceDetailItemDTO dto = new EmployeeInsuranceDetailResponseDTO.InsuranceDetailItemDTO();
        dto.setType(contract.getCoverage() != null && contract.getCoverage().contains("BHXH") ? "BHXH" : "BHYT");
        dto.setStart(contract.getStartDate() != null ? contract.getStartDate().format(DATE_FORMATTER) : null);
        dto.setEnd(contract.getEndDate() != null ? contract.getEndDate().format(DATE_FORMATTER) : null);
        dto.setDependents(0); // TODO: Get from database
        if (dto.getType().equals("BHYT")) {
            dto.setHospitalName("BV Bạch Mai"); // TODO: Get from database
        }
        return dto;
    }

    private Integer parseMonthlyValue(String cost) {
        if (cost == null || cost.isEmpty()) {
            return 0;
        }
        try {
            // Remove "VNĐ", commas, spaces and parse
            String cleaned = cost.replaceAll("[^0-9]", "");
            return Integer.parseInt(cleaned);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}

