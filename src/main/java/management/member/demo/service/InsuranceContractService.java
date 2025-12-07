package management.member.demo.service;

import management.member.demo.dto.CreateInsuranceContractRequestDTO;
import management.member.demo.dto.InsuranceContractResponseDTO;
import management.member.demo.dto.UpdateInsuranceContractRequestDTO;
import management.member.demo.entity.InsuranceContract;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.InsuranceContractMapper;
import management.member.demo.repository.InsuranceContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service quản lý InsuranceContract (template contracts)
 */
@Service
@Transactional
public class InsuranceContractService {

    @Autowired
    private InsuranceContractRepository insuranceContractRepository;

    @Autowired
    private InsuranceContractMapper insuranceContractMapper;

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
        // Kiểm tra insurenceName đã tồn tại chưa
        if (insuranceContractRepository.existsByInsurenceName(request.getInsurenceName())) {
            throw new IllegalArgumentException("Insurance contract với tên '" + request.getInsurenceName() + "' đã tồn tại");
        }
        
        // Map từ DTO sang Entity
        InsuranceContract contract = insuranceContractMapper.toEntity(request);
        
        // Lưu lại
        InsuranceContract saved = insuranceContractRepository.save(contract);
        
        // Map từ Entity sang DTO
        return insuranceContractMapper.toResponseDTO(saved);
    }

    /**
     * Cập nhật insurance contract theo insurenceName
     */
    public InsuranceContractResponseDTO updateInsuranceContract(String insurenceName, UpdateInsuranceContractRequestDTO request) {
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
        
        // Cập nhật các field từ request
        insuranceContractMapper.updateEntityFromRequest(contract, request);
        
        // Lưu lại
        InsuranceContract saved = insuranceContractRepository.save(contract);
        
        // Map từ Entity sang DTO
        return insuranceContractMapper.toResponseDTO(saved);
    }

    /**
     * Xóa insurance contract theo insurenceName
     * Cho phép xóa ngay cả khi có EmployeeInsuranceContract đang sử dụng
     * EmployeeInsuranceContract sẽ tự động bị xóa khi hết hạn (expiry date)
     */
    public void deleteInsuranceContract(String insurenceName) {
        // Tìm contract theo insurenceName
        InsuranceContract contract = insuranceContractRepository.findByInsurenceName(insurenceName)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Insurance Contract", "insurenceName", insurenceName
                ));
        
        // Cho phép xóa contract template ngay cả khi có EmployeeInsuranceContract đang sử dụng
        // EmployeeInsuranceContract sẽ tự động bị xóa khi hết hạn (expiry date < today)
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

