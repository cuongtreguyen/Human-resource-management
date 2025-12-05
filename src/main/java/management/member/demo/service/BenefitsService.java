package management.member.demo.service;

import management.member.demo.dto.AllBenefitResponseDTO;
import management.member.demo.dto.CreateBenefitRequestDTO;
import management.member.demo.dto.UpdateBenefitRequestDTO;
import management.member.demo.entity.Benefits;
import management.member.demo.entity.EmployeeBenefits;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.BenefitsMapper;
import management.member.demo.repository.BenefitsRepository;
import management.member.demo.repository.EmployeeBenefitsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service quản lý Benefits (template benefits)
 */
@Service
@Transactional
public class BenefitsService {

    @Autowired
    private BenefitsRepository benefitsRepository;

    @Autowired
    private BenefitsMapper benefitsMapper;

    @Autowired
    private EmployeeBenefitsRepository employeeBenefitsRepository;

    /**
     * Lấy tất cả danh sách benefits (templates)
     */
    public List<AllBenefitResponseDTO> getAllBenefits() {
        List<Benefits> benefits = benefitsRepository.findAll();
        return benefits.stream()
                .map(benefit -> {
                    AllBenefitResponseDTO dto = benefitsMapper.toResponseDTO(benefit);
                    
                    // Tính totalCost từ EmployeeBenefits thực tế
                    List<EmployeeBenefits> employeeBenefits = employeeBenefitsRepository.findByBenefit(benefit);
                    int actualNumberOfEmployees = employeeBenefits.size();
                    dto.setNumberOfEmployees(actualNumberOfEmployees);
                    
                    // Tính totalCost = actualNumberOfEmployees * allowance_amount (đã được convert trong mapper)
                    BigDecimal totalCost = BigDecimal.ZERO;
                    if (dto.getAllowance_amount() != null && dto.getAllowance_amount().compareTo(BigDecimal.ZERO) > 0) {
                        totalCost = dto.getAllowance_amount().multiply(new BigDecimal(actualNumberOfEmployees));
                    }
                    dto.setTotalCost(totalCost);
                    
                    // Lấy department từ EmployeeBenefits (lấy department đầu tiên nếu có)
                    String department = employeeBenefits.stream()
                            .filter(eb -> eb.getEmployee() != null && eb.getEmployee().getDepartment() != null)
                            .map(eb -> eb.getEmployee().getDepartment())
                            .findFirst()
                            .orElse(null);
                    dto.setDepartment(department);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Tạo benefit mới (template)
     */
    public AllBenefitResponseDTO createBenefit(CreateBenefitRequestDTO request) {
        // Kiểm tra benefitId đã tồn tại chưa
        if (benefitsRepository.existsByBenefitId(request.getBenefitId())) {
            throw new IllegalArgumentException("Benefit với ID '" + request.getBenefitId() + "' đã tồn tại");
        }
        
        // Map từ DTO sang Entity
        Benefits benefit = benefitsMapper.toEntity(request);
        
        // Lưu lại
        Benefits saved = benefitsRepository.save(benefit);
        
        // Map từ Entity sang DTO
        return benefitsMapper.toResponseDTO(saved);
    }

    /**
     * Cập nhật benefit theo benefitId
     */
    public AllBenefitResponseDTO updateBenefit(String benefitId, UpdateBenefitRequestDTO request) {
        // Tìm benefit theo benefitId
        Benefits benefit = benefitsRepository.findByBenefitId(benefitId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Benefit", "benefitId", benefitId
                ));
        
        // Cập nhật các field từ request
        benefitsMapper.updateEntityFromRequest(benefit, request);
        
        // Lưu lại
        Benefits saved = benefitsRepository.save(benefit);
        
        // Map từ Entity sang DTO
        return benefitsMapper.toResponseDTO(saved);
    }

    /**
     * Xóa benefit theo benefitId
     */
    public void deleteBenefit(String benefitId) {
        // Tìm benefit theo benefitId
        Benefits benefit = benefitsRepository.findByBenefitId(benefitId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Benefit", "benefitId", benefitId
                ));
        
        // Xóa benefit
        benefitsRepository.delete(benefit);
    }

    /**
     * Lấy benefit theo ID
     */
    public Benefits getBenefitById(Long id) {
        return benefitsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Benefit", "id", String.valueOf(id)
                ));
    }

    /**
     * Lấy benefit theo benefitId
     */
    public Benefits getBenefitByBenefitId(String benefitId) {
        return benefitsRepository.findByBenefitId(benefitId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Benefit", "benefitId", benefitId
                ));
    }
}
