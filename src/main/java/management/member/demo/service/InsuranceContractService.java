package management.member.demo.service;

import management.member.demo.dto.CreateInsuranceContractRequestDTO;
import management.member.demo.dto.InsuranceContractResponseDTO;
import management.member.demo.dto.UpdateInsuranceContractRequestDTO;
import management.member.demo.entity.InsuranceContract;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.InsuranceContractMapper;
import management.member.demo.repository.InsuranceContractRepository;
import management.member.demo.repository.EmployeeInsuranceContractRepository;
import management.member.demo.repository.NotificationRepository;
import management.member.demo.validator.InsuranceContractValidator;
import management.member.demo.entity.Notification;
import management.member.demo.enums.InsuranceContractStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service quản lý InsuranceContract (template contracts)
 */
@Service
@Transactional
public class InsuranceContractService {

    private static final Logger logger = LoggerFactory.getLogger(InsuranceContractService.class);

    @Autowired
    private InsuranceContractRepository insuranceContractRepository;

    @Autowired
    private InsuranceContractMapper insuranceContractMapper;

    @Autowired
    private EmployeeInsuranceContractRepository employeeInsuranceContractRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private InsuranceContractValidator insuranceContractValidator;

    /**
     * Lấy tất cả danh sách insurance contracts (templates)
     */
    public List<InsuranceContractResponseDTO> getAllInsuranceContracts() {
        List<InsuranceContract> contracts = insuranceContractRepository.findAll();
        return contracts.stream()
                .map(insuranceContractMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Tạo insurance contract mới (template)
     */
    public InsuranceContractResponseDTO createInsuranceContract(CreateInsuranceContractRequestDTO request) {
        insuranceContractValidator.validateCreateInsuranceContractRequest(request);
        
        // Map từ DTO sang Entity
        InsuranceContract contract = insuranceContractMapper.toEntity(request);
        
        // Lưu lại
        InsuranceContract saved = insuranceContractRepository.save(contract);
        
        // Map từ Entity sang DTO
        return insuranceContractMapper.toResponseDTO(saved);
    }

    /**
     * Cập nhật insurance contract theo insurenceName
     * Khi update, chỉ xóa các EmployeeInsuranceContract đã hết hạn (expiry < today)
     * Không xóa các EmployeeInsuranceContract còn đang sử dụng (chưa hết hạn)
     */
    public InsuranceContractResponseDTO updateInsuranceContract(String insurenceName, UpdateInsuranceContractRequestDTO request) {
        insuranceContractValidator.validateUpdateInsuranceContractRequest(insurenceName, request);
        
        // Tìm contract theo insurenceName
        InsuranceContract contract = insuranceContractRepository.findByInsurenceName(insurenceName)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Insurance Contract", "insurenceName", insurenceName
                ));
        
        // Kiểm tra nếu update insurenceName: phải đảm bảo không trùng với contract khác
        if (request.getInsurenceName() != null && !request.getInsurenceName().equals(insurenceName)) {
            // Kiểm tra insurenceName mới có trùng với contract khác không
            if (insuranceContractRepository.existsByInsurenceName(request.getInsurenceName())) {
                throw new IllegalArgumentException("Insurance contract với tên '" + request.getInsurenceName() + "' đã tồn tại");
            }
        }
        
        // Tìm tất cả EmployeeInsuranceContract đang sử dụng contract này
        List<management.member.demo.entity.EmployeeInsuranceContract> employeeContracts = 
                employeeInsuranceContractRepository.findByContract(contract);
        
        // Chỉ xóa các EmployeeInsuranceContract đã hết hạn (expiry < today)
        LocalDate today = LocalDate.now();
        List<management.member.demo.entity.EmployeeInsuranceContract> expiredContracts = employeeContracts.stream()
                .filter(ec -> ec.getExpiry() != null && ec.getExpiry().isBefore(today))
                .collect(Collectors.toList());
        
        // Xóa các contract đã hết hạn và gửi thông báo
        if (!expiredContracts.isEmpty()) {
            employeeInsuranceContractRepository.deleteAll(expiredContracts);
            String message = String.format(
                "Đã xóa %d EmployeeInsuranceContract đã hết hạn khi update Insurance Contract '%s'",
                expiredContracts.size(),
                insurenceName
            );
            logger.info(message);
            // Có thể throw exception với message hoặc log như trên
            // throw new IllegalStateException(message);
        }
        
        // Cập nhật các field từ request
        insuranceContractMapper.updateEntityFromRequest(contract, request);
        
        // Lưu lại
        InsuranceContract saved = insuranceContractRepository.save(contract);
        
        // Kiểm tra và gửi thông báo nếu contract không hoạt động hoặc hết hạn
        checkAndNotifyInsuranceContractStatus(saved);
        
        // Map từ Entity sang DTO
        return insuranceContractMapper.toResponseDTO(saved);
    }
    
    /**
     * Kiểm tra và gửi thông báo nếu Insurance Contract không hoạt động hoặc hết hạn
     */
    private void checkAndNotifyInsuranceContractStatus(InsuranceContract contract) {
        LocalDate today = LocalDate.now();
        boolean isExpired = contract.getExpiry() != null && contract.getExpiry().isBefore(today);
        boolean isInactive = contract.getStatus() == InsuranceContractStatus.INACTIVE || 
                            contract.getStatus() == InsuranceContractStatus.EXPIRED;
        
        if (isExpired || isInactive) {
            String title = "Cảnh báo: Insurance Contract không hoạt động hoặc đã hết hạn";
            String message = String.format(
                "Insurance Contract '%s' %s. Vui lòng kiểm tra và cập nhật.",
                contract.getInsurenceName(),
                isExpired ? "đã hết hạn (expiry: " + contract.getExpiry() + ")" : 
                           "không còn hoạt động (status: " + contract.getStatus() + ")"
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
     * Xóa insurance contract theo insurenceName
     * Chỉ cho phép xóa khi TẤT CẢ EmployeeInsuranceContract đã hết hạn (expiry < today)
     * Nếu có EmployeeInsuranceContract hết hạn thì xóa chúng và gửi thông báo
     * Nếu còn EmployeeInsuranceContract chưa hết hạn thì không cho phép xóa
     */
    public void deleteInsuranceContract(String insurenceName) {
        insuranceContractValidator.validateInsuranceContractName(insurenceName);
        
        // Tìm contract theo insurenceName
        InsuranceContract contract = insuranceContractRepository.findByInsurenceName(insurenceName)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Insurance Contract", "insurenceName", insurenceName
                ));
        
        // Tìm tất cả EmployeeInsuranceContract đang sử dụng contract này
        List<management.member.demo.entity.EmployeeInsuranceContract> employeeContracts = 
                employeeInsuranceContractRepository.findByContract(contract);
        
        LocalDate today = LocalDate.now();
        
        // Phân loại: contract đã hết hạn và contract còn đang sử dụng
        List<management.member.demo.entity.EmployeeInsuranceContract> expiredContracts = employeeContracts.stream()
                .filter(ec -> ec.getExpiry() != null && ec.getExpiry().isBefore(today))
                .collect(Collectors.toList());
        
        List<management.member.demo.entity.EmployeeInsuranceContract> activeContracts = employeeContracts.stream()
                .filter(ec -> ec.getExpiry() == null || !ec.getExpiry().isBefore(today))
                .collect(Collectors.toList());
        
        // Nếu còn contract đang sử dụng (chưa hết hạn) thì không cho phép xóa
        if (!activeContracts.isEmpty()) {
            throw new IllegalStateException(
                "Không thể xóa Insurance Contract '" + insurenceName + 
                "' vì còn " + activeContracts.size() + 
                " nhân viên đang sử dụng contract này (chưa hết hạn). " +
                "Vui lòng đợi đến khi tất cả contract hết hạn."
            );
        }
        
        // Xóa các contract đã hết hạn (nếu có)
        if (!expiredContracts.isEmpty()) {
            employeeInsuranceContractRepository.deleteAll(expiredContracts);
            String message = String.format(
                "Đã xóa %d EmployeeInsuranceContract đã hết hạn khi delete Insurance Contract '%s'",
                expiredContracts.size(),
                insurenceName
            );
            logger.info(message);
        }
        
        // Kiểm tra và gửi thông báo nếu contract không hoạt động hoặc hết hạn trước khi xóa
        checkAndNotifyInsuranceContractStatus(contract);
        
        // Xóa contract template
        insuranceContractRepository.delete(contract);
    }

    /**
     * Lấy insurance contract theo ID
     */
    public InsuranceContract getInsuranceContractById(Long contractId) {
        return insuranceContractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Insurance Contract", "id", String.valueOf(contractId)
                ));
    }

    /**
     * Lấy insurance contract theo insurenceName
     */
    public InsuranceContract getInsuranceContractByName(String insurenceName) {
        return insuranceContractRepository.findByInsurenceName(insurenceName)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Insurance Contract", "insurenceName", insurenceName
                ));
    }
}

