package management.member.demo.normalizer.common;

import management.member.demo.normalizer.config.GenderMappingConfig;
import management.member.demo.normalizer.config.ContractTypeMappingConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * Common Mapping Utilities
 * 
 * Chứa các mapping logic dùng chung cho mọi normalizer:
 * - Gender mapping
 * - Contract type mapping
 * - Time parsing
 * - Employee ID parsing
 * - Name splitting
 * 
 * Tránh lặp code giữa các normalizer
 */
@Component
public class CommonMappingUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(CommonMappingUtils.class);
    
    private final GenderMappingConfig genderMappingConfig;
    private final ContractTypeMappingConfig contractTypeMappingConfig;
    
    @Autowired
    public CommonMappingUtils(GenderMappingConfig genderMappingConfig,
                             ContractTypeMappingConfig contractTypeMappingConfig) {
        this.genderMappingConfig = genderMappingConfig;
        this.contractTypeMappingConfig = contractTypeMappingConfig;
    }
    
    /**
     * Normalize gender: "Nam"/"Nữ" → "male"/"female"
     * 
     * Logging levels:
     * - DEBUG: Success normalization
     * - WARN: Unknown value, using fallback
     * - ERROR: Parse/exception error
     * 
     * @param gender FE gender value
     * @return BE gender value ("male" hoặc "female")
     */
    public String normalizeGender(String gender) {
        if (gender == null || gender.trim().isEmpty()) {
            return null;
        }
        
        try {
            String original = gender.trim();
            String normalized = genderMappingConfig.normalize(original);
            
            // DEBUG: Log success normalization
            if (!original.equals(normalized)) {
                logger.debug("Normalized gender '{}' → '{}'", original, normalized);
            }
            
            // WARN: Check if using fallback (lowercase)
            if (!genderMappingConfig.isValid(original) && normalized.equals(original.toLowerCase())) {
                logger.warn("Unknown gender value '{}', using lowercase as fallback: '{}'", original, normalized);
            }
            
            return normalized;
        } catch (Exception e) {
            // ERROR: Log exception
            logger.error("Error normalizing gender '{}': {}", gender, e.getMessage(), e);
            throw new IllegalArgumentException("Failed to normalize gender: " + e.getMessage(), e);
        }
    }
    
    /**
     * Normalize contractType: Vietnamese → English
     * 
     * Logging levels:
     * - DEBUG: Success normalization
     * - WARN: Unknown value, using as is
     * - ERROR: Parse/exception error
     * 
     * @param contractType FE contract type value
     * @return BE contract type value (Full-time, Part-time, Probation)
     */
    public String normalizeContractType(String contractType) {
        if (contractType == null || contractType.trim().isEmpty()) {
            return null;
        }
        
        try {
            String original = contractType.trim();
            String normalized = contractTypeMappingConfig.normalize(original);
            
            // DEBUG: Log success normalization
            if (!original.equals(normalized)) {
                logger.debug("Normalized contractType '{}' → '{}'", original, normalized);
            } else {
                // WARN: Unknown value, using as is (fallback)
                logger.warn("Unknown contractType '{}', using as is (no mapping found)", original);
            }
            
            return normalized;
        } catch (Exception e) {
            // ERROR: Log exception
            logger.error("Error normalizing contractType '{}': {}", contractType, e.getMessage(), e);
            throw new IllegalArgumentException("Failed to normalize contractType: " + e.getMessage(), e);
        }
    }
    
    /**
     * Parse time string và convert sang LocalTime
     * Hỗ trợ cả "HH:mm" và "HH:mm:ss"
     * 
     * @param timeString Time string từ FE
     * @return LocalTime object
     * @throws IllegalArgumentException nếu format không hợp lệ
     */
    public LocalTime parseTime(String timeString) {
        if (timeString == null || timeString.trim().isEmpty()) {
            return null;
        }

        String normalized = timeString.trim();

        // Thử parse với format "HH:mm:ss"
        try {
            LocalTime result = LocalTime.parse(normalized, DateTimeFormatter.ofPattern("HH:mm:ss"));
            // DEBUG: Log success parse
            logger.debug("Parsed time '{}' → {}", normalized, result);
            return result;
        } catch (DateTimeParseException e) {
            // Nếu không được, thử parse với format "HH:mm"
            try {
                LocalTime result = LocalTime.parse(normalized, DateTimeFormatter.ofPattern("HH:mm"));
                // DEBUG: Log success parse (added seconds)
                logger.debug("Parsed time '{}' → {} (added seconds)", normalized, result);
                return result;
            } catch (DateTimeParseException e2) {
                // ERROR: Log parse failure
                logger.error("Invalid time format: '{}'. Expected format: HH:mm or HH:mm:ss", normalized);
                throw new IllegalArgumentException("Invalid time format: " + normalized + 
                    ". Expected format: HH:mm or HH:mm:ss", e2);
            }
        }
    }
    
    /**
     * Parse employeeId từ String hoặc Long
     * 
     * @param employeeId Employee ID từ FE (String hoặc Long)
     * @return Long employee ID
     * @throws IllegalArgumentException nếu format không hợp lệ
     */
    public Long parseEmployeeId(Object employeeId) {
        if (employeeId == null) {
            return null;
        }

        if (employeeId instanceof Long) {
            // DEBUG: Log success (already Long)
            logger.debug("Employee ID is already Long: {}", employeeId);
            return (Long) employeeId;
        }

        if (employeeId instanceof String) {
            String employeeIdStr = (String) employeeId;
            try {
                Long result = Long.parseLong(employeeIdStr);
                // DEBUG: Log success parse
                logger.debug("Parsed employee ID '{}' → {}", employeeIdStr, result);
                return result;
            } catch (NumberFormatException e) {
                // ERROR: Log parse failure
                logger.error("Invalid employee ID format: '{}'. Expected numeric string or Long", employeeIdStr);
                throw new IllegalArgumentException("Invalid employee ID format: " + employeeIdStr + 
                    ". Expected numeric string or Long", e);
            }
        }

        // ERROR: Log invalid type
        logger.error("Invalid employee ID type: {}. Expected String or Long", employeeId.getClass().getName());
        throw new IllegalArgumentException("Employee ID must be String or Long, got: " + 
            employeeId.getClass().getName());
    }
    
    /**
     * Split full name thành firstName và lastName
     * Logic: Lấy từ cuối cùng làm lastName, phần còn lại làm firstName
     * 
     * @param fullName Full name string
     * @return Array [firstName, lastName]
     */
    public String[] splitName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return new String[]{"", ""};
        }

        String trimmed = fullName.trim();
        String[] words = trimmed.split("\\s+");
        
        if (words.length == 1) {
            return new String[]{words[0], ""};
        }

        // Lấy từ cuối cùng làm lastName
        String lastName = words[words.length - 1];
        
        // Phần còn lại làm firstName
        String firstName = trimmed.substring(0, trimmed.lastIndexOf(lastName)).trim();
        
        logger.debug("Split name '{}' → firstName: '{}', lastName: '{}'", fullName, firstName, lastName);
        
        return new String[]{firstName, lastName};
    }
}

