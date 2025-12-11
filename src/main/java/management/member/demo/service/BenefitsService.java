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
import management.member.demo.repository.NotificationRepository;
import management.member.demo.entity.Notification;
import management.member.demo.enums.BenefitsStatus;
import management.member.demo.validator.BenefitsValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service quản lý Benefits (template benefits)
 */
@Service
@Transactional
public class BenefitsService {

    private static final Logger logger = LoggerFactory.getLogger(BenefitsService.class);

    @Autowired
    private BenefitsRepository benefitsRepository;

    @Autowired
    private BenefitsMapper benefitsMapper;

    @Autowired
    private EmployeeBenefitsRepository employeeBenefitsRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private BenefitsValidator benefitsValidator;

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
        benefitsValidator.validateCreateBenefitRequest(request);
        
        // Map từ DTO sang Entity
        Benefits benefit = benefitsMapper.toEntity(request);
        
        // Lưu lại
        Benefits saved = benefitsRepository.save(benefit);
        
        // Map từ Entity sang DTO
        return benefitsMapper.toResponseDTO(saved);
    }

    /**
     * Cập nhật benefit theo benefitId
     * Khi update, chỉ xóa các EmployeeBenefits đã hết hạn hoặc không còn hoạt động (status = EXPIRED hoặc INACTIVE)
     * Không xóa các EmployeeBenefits còn đang hoạt động (status = ACTIVE)
     */
    public AllBenefitResponseDTO updateBenefit(String benefitId, UpdateBenefitRequestDTO request) {
        benefitsValidator.validateUpdateBenefitRequest(benefitId, request);
        
        // Tìm benefit theo benefitId
        Benefits benefit = benefitsRepository.findByBenefitId(benefitId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Benefit", "benefitId", benefitId
                ));
        
        // Tìm tất cả EmployeeBenefits đang sử dụng benefit này
        List<EmployeeBenefits> employeeBenefits = employeeBenefitsRepository.findByBenefit(benefit);
        
        // Chỉ xóa các EmployeeBenefits đã hết hạn hoặc không còn hoạt động
        List<EmployeeBenefits> expiredOrInactiveBenefits = employeeBenefits.stream()
                .filter(eb -> eb.getStatus() != null && 
                        (eb.getStatus() == management.member.demo.enums.BenefitsStatus.EXPIRED || 
                         eb.getStatus() == management.member.demo.enums.BenefitsStatus.INACTIVE))
                .collect(Collectors.toList());
        
        // Xóa các benefit đã hết hạn/không hoạt động và gửi thông báo
        if (!expiredOrInactiveBenefits.isEmpty()) {
            employeeBenefitsRepository.deleteAll(expiredOrInactiveBenefits);
            String message = String.format(
                "Đã xóa %d EmployeeBenefits đã hết hạn hoặc không hoạt động khi update Benefit '%s'",
                expiredOrInactiveBenefits.size(),
                benefitId
            );
            logger.info(message);
            // Có thể throw exception với message hoặc log như trên
            // throw new IllegalStateException(message);
        }
        
        // Cập nhật các field từ request
        benefitsMapper.updateEntityFromRequest(benefit, request);
        
        // Lưu lại
        Benefits saved = benefitsRepository.save(benefit);
        
        // Kiểm tra và gửi thông báo nếu benefit không hoạt động hoặc hết hạn
        checkAndNotifyBenefitStatus(saved);
        
        // Map từ Entity sang DTO
        return benefitsMapper.toResponseDTO(saved);
    }
    
    /**
     * Kiểm tra và gửi thông báo nếu Benefit không hoạt động hoặc hết hạn
     */
    private void checkAndNotifyBenefitStatus(Benefits benefit) {
        boolean isInactive = benefit.getStatus() == BenefitsStatus.INACTIVE || 
                            benefit.getStatus() == BenefitsStatus.EXPIRED;
        
        if (isInactive) {
            String title = "Cảnh báo: Benefit không hoạt động hoặc đã hết hạn";
            String message = String.format(
                "Benefit '%s' (ID: %s) không còn hoạt động (status: %s). Vui lòng kiểm tra và cập nhật.",
                benefit.getBenefitName(),
                benefit.getBenefitId(),
                benefit.getStatus()
            );
            
            Notification notification = new Notification();
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType("warning");
            notification.setPriority("high");
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            
            notificationRepository.save(notification);
            logger.info("Đã tạo thông báo: {}", message);
        }
    }

    /**
     * Xóa benefit theo benefitId
     * Chỉ cho phép xóa khi TẤT CẢ EmployeeBenefits đã hết hạn hoặc không còn hoạt động (status = EXPIRED hoặc INACTIVE)
     * Nếu có EmployeeBenefits hết hạn/không hoạt động thì xóa chúng và gửi thông báo
     * Nếu còn EmployeeBenefits đang ACTIVE thì không cho phép xóa
     */
    public void deleteBenefit(String benefitId) {
        benefitsValidator.validateBenefitId(benefitId);
        
        // Tìm benefit theo benefitId
        Benefits benefit = benefitsRepository.findByBenefitId(benefitId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Benefit", "benefitId", benefitId
                ));
        
        // Tìm tất cả EmployeeBenefits đang sử dụng benefit này
        List<EmployeeBenefits> employeeBenefits = employeeBenefitsRepository.findByBenefit(benefit);
        
        // Phân loại: benefit hết hạn/không hoạt động và benefit đang hoạt động
        List<EmployeeBenefits> expiredOrInactiveBenefits = employeeBenefits.stream()
                .filter(eb -> eb.getStatus() != null && 
                        (eb.getStatus() == management.member.demo.enums.BenefitsStatus.EXPIRED || 
                         eb.getStatus() == management.member.demo.enums.BenefitsStatus.INACTIVE))
                .collect(Collectors.toList());
        
        List<EmployeeBenefits> activeBenefits = employeeBenefits.stream()
                .filter(eb -> eb.getStatus() == null || 
                        eb.getStatus() == management.member.demo.enums.BenefitsStatus.ACTIVE)
                .collect(Collectors.toList());
        
        // Nếu còn benefit đang hoạt động (ACTIVE) thì không cho phép xóa
        if (!activeBenefits.isEmpty()) {
            throw new IllegalStateException(
                "Không thể xóa Benefit '" + benefitId + 
                "' vì còn " + activeBenefits.size() + 
                " nhân viên đang sử dụng benefit này (status = ACTIVE). " +
                "Vui lòng đợi đến khi tất cả benefit hết hạn hoặc không còn hoạt động."
            );
        }
        
        // Xóa các benefit đã hết hạn/không hoạt động (nếu có)
        if (!expiredOrInactiveBenefits.isEmpty()) {
            employeeBenefitsRepository.deleteAll(expiredOrInactiveBenefits);
            String message = String.format(
                "Đã xóa %d EmployeeBenefits đã hết hạn hoặc không hoạt động khi delete Benefit '%s'",
                expiredOrInactiveBenefits.size(),
                benefitId
            );
            logger.info(message);
        }
        
        // Kiểm tra và gửi thông báo nếu benefit không hoạt động hoặc hết hạn trước khi xóa
        checkAndNotifyBenefitStatus(benefit);
        
        // Xóa benefit template
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
