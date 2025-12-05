package management.member.demo.mapper;

import management.member.demo.dto.AllBenefitResponseDTO;
import management.member.demo.dto.CreateBenefitRequestDTO;
import management.member.demo.dto.UpdateBenefitRequestDTO;
import management.member.demo.entity.Benefits;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Mapper cho Benefits (template benefit)
 */
@Component
public class BenefitsMapper {

    /**
     * Map CreateBenefitRequestDTO sang Benefits entity
     */
    public Benefits toEntity(CreateBenefitRequestDTO request) {
        if (request == null) {
            return null;
        }
        
        Benefits benefit = new Benefits();
        benefit.setBenefitId(request.getBenefitId());
        benefit.setBenefitName(request.getBenefitName());
        benefit.setDescription(request.getDescription());
        benefit.setNumberOfEmployees(request.getNumberOfEmployees());
        benefit.setCoverage(request.getCoverage());
        benefit.setAllowanceAmount(request.getAllowanceAmount());
        benefit.setStatus(request.getStatus());
        return benefit;
    }

    /**
     * Map Benefits entity sang AllBenefitResponseDTO
     */
    public AllBenefitResponseDTO toResponseDTO(Benefits benefit) {
        if (benefit == null) {
            return null;
        }
        
        AllBenefitResponseDTO dto = new AllBenefitResponseDTO();
        dto.setBenefitName(benefit.getBenefitName());
        dto.setAllowance_amount(benefit.getAllowanceAmount() != null ? benefit.getAllowanceAmount() : BigDecimal.ZERO);
        dto.setDepartment(null); // Department không có trong Benefits entity, có thể set null hoặc lấy từ EmployeeBenefits
        dto.setNumberOfEmployees(benefit.getNumberOfEmployees() != null ? benefit.getNumberOfEmployees() : 0);
        dto.setStatus(benefit.getStatus());
        
        // Tính totalCost = numberOfEmployees * allowanceAmount
        BigDecimal totalCost = BigDecimal.ZERO;
        if (benefit.getNumberOfEmployees() != null && benefit.getAllowanceAmount() != null && benefit.getAllowanceAmount().compareTo(BigDecimal.ZERO) > 0) {
            totalCost = benefit.getAllowanceAmount().multiply(new BigDecimal(benefit.getNumberOfEmployees()));
        }
        dto.setTotalCost(totalCost);
        
        return dto;
    }

    /**
     * Map UpdateBenefitRequestDTO sang Benefits entity (update existing)
     */
    public void updateEntityFromRequest(Benefits benefit, UpdateBenefitRequestDTO request) {
        if (benefit == null || request == null) {
            return;
        }
        
        benefit.setBenefitName(request.getBenefitName());
        if (request.getDescription() != null) {
            benefit.setDescription(request.getDescription());
        }
        if (request.getNumberOfEmployees() != null) {
            benefit.setNumberOfEmployees(request.getNumberOfEmployees());
        }
        if (request.getCoverage() != null) {
            benefit.setCoverage(request.getCoverage());
        }
        if (request.getAllowanceAmount() != null) {
            benefit.setAllowanceAmount(request.getAllowanceAmount());
        }
        if (request.getStatus() != null) {
            benefit.setStatus(request.getStatus());
        }
    }
}
