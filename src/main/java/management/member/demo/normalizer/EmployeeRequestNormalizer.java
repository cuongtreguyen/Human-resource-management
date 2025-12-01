package management.member.demo.normalizer;

import management.member.demo.dto.AddEmployeeRequest;
import management.member.demo.dto.UpdateEmployeeRequest;
import management.member.demo.normalizer.common.CommonMappingUtils;
import management.member.demo.normalizer.common.RequestNormalizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Normalizer cho Employee Requests
 * 
 * Nhiệm vụ: Chuyển đổi tất cả input từ FE → format chuẩn của BE
 * - FE có thể gửi bất kỳ field gì (name, fullName, firstName/lastName, gender_vi, contract, idPerson...)
 * - BE chỉ nhận format chuẩn (firstName, lastName, gender, contractType, employeeId, hireDate)
 * 
 * Lưu ý:
 * - Chỉ làm nhiệm vụ convert/transform, KHÔNG validate business rules
 * - Validation nên nằm ở Validator layer hoặc Service layer
 * - Log rõ ràng khi có field không hợp lệ để dễ debug
 * 
 * Mapping rules:
 * - name → firstName + lastName
 * - gender_vi (Nam/Nữ) → gender (male/female)
 * - contract → contractType
 * - idPerson → employeeId
 * - startDate → hireDate
 */
@Component
public class EmployeeRequestNormalizer implements RequestNormalizer<AddEmployeeRequest> {
    
    private static final Logger logger = LoggerFactory.getLogger(EmployeeRequestNormalizer.class);
    
    private final CommonMappingUtils commonMappingUtils;
    
    @Autowired
    public EmployeeRequestNormalizer(CommonMappingUtils commonMappingUtils) {
        this.commonMappingUtils = commonMappingUtils;
    }
    
    /**
     * Normalize AddEmployeeRequest từ FE format → BE format
     * 
     * FE có thể gửi:
     * - name hoặc firstName/lastName
     * - gender_vi (Nam/Nữ) hoặc gender (male/female)
     * - contract hoặc contractType
     * - idPerson hoặc employeeId
     * 
     * Lưu ý: Chỉ convert/transform, KHÔNG validate business rules
     */
    @Override
    public void normalize(AddEmployeeRequest request) {
        if (request == null) {
            logger.warn("AddEmployeeRequest is null, skipping normalization");
            return;
        }

        try {
            // Mapping: name → firstName + lastName
            // FE có thể gửi name hoặc firstName/lastName riêng
            if ((request.getFirstName() == null || request.getFirstName().trim().isEmpty()) &&
                (request.getLastName() == null || request.getLastName().trim().isEmpty())) {
                // Nếu không có firstName/lastName, parse từ name
                if (request.getName() != null && !request.getName().trim().isEmpty()) {
                    String[] nameParts = commonMappingUtils.splitName(request.getName().trim());
                    request.setFirstName(nameParts[0]);
                    request.setLastName(nameParts.length > 1 ? nameParts[1] : "");
                    logger.debug("Normalized name '{}' → firstName: '{}', lastName: '{}'", 
                        request.getName(), request.getFirstName(), request.getLastName());
                } else {
                    logger.warn("AddEmployeeRequest missing both name and firstName/lastName");
                }
            } else if (request.getName() == null || request.getName().trim().isEmpty()) {
                // Nếu có firstName/lastName nhưng không có name, OK
                logger.debug("Using firstName/lastName directly: firstName: '{}', lastName: '{}'", 
                    request.getFirstName(), request.getLastName());
            }

            // Mapping: gender_vi (Nam/Nữ) → gender (male/female)
            if (request.getGender() != null) {
                String normalizedGender = commonMappingUtils.normalizeGender(request.getGender());
                request.setGender(normalizedGender);
            }

            // Mapping: contractType Vietnamese → English
            if (request.getContractType() != null) {
                String normalizedContractType = commonMappingUtils.normalizeContractType(request.getContractType());
                request.setContractType(normalizedContractType);
            }
        } catch (Exception e) {
            logger.error("Error normalizing AddEmployeeRequest: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to normalize employee request: " + e.getMessage(), e);
        }
    }

    /**
     * Normalize UpdateEmployeeRequest từ FE format → BE format
     * 
     * FE có thể gửi:
     * - name hoặc firstName/lastName
     * - gender_vi (Nam/Nữ) hoặc gender (male/female)
     * - startDate hoặc hireDate
     * 
     * Lưu ý: Chỉ convert/transform, KHÔNG validate business rules
     */
    public void normalize(UpdateEmployeeRequest request) {
        if (request == null) {
            logger.warn("UpdateEmployeeRequest is null, skipping normalization");
            return;
        }

        try {
            // Mapping: name → firstName + lastName
            if ((request.getFirstName() == null || request.getFirstName().trim().isEmpty()) &&
                (request.getLastName() == null || request.getLastName().trim().isEmpty())) {
                if (request.getName() != null && !request.getName().trim().isEmpty()) {
                    String[] nameParts = commonMappingUtils.splitName(request.getName().trim());
                    request.setFirstName(nameParts[0]);
                    request.setLastName(nameParts.length > 1 ? nameParts[1] : "");
                    logger.debug("Normalized update name '{}' → firstName: '{}', lastName: '{}'", 
                        request.getName(), request.getFirstName(), request.getLastName());
                }
            }

            // Mapping: gender_vi (Nam/Nữ) → gender (male/female)
            if (request.getGender() != null) {
                String normalizedGender = commonMappingUtils.normalizeGender(request.getGender());
                request.setGender(normalizedGender);
            }

            // Mapping: startDate → hireDate (UpdateEmployeeRequest đã có startDate, không cần normalize)
            // Note: Nếu FE gửi cả startDate và hireDate, ưu tiên startDate
        } catch (Exception e) {
            logger.error("Error normalizing UpdateEmployeeRequest: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to normalize employee update request: " + e.getMessage(), e);
        }
    }


}

