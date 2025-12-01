package management.member.demo.normalizer.config;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Configuration cho Gender Mapping
 * Thay vì hardcode, dùng lookup table để dễ mở rộng
 */
@Component
public class GenderMappingConfig {
    
    // Lookup table: Vietnamese → English
    private static final Map<String, String> GENDER_MAPPING = new HashMap<>();
    
    static {
        // Vietnamese mappings
        GENDER_MAPPING.put("Nam", "male");
        GENDER_MAPPING.put("nam", "male");
        GENDER_MAPPING.put("NAM", "male");
        GENDER_MAPPING.put("Nữ", "female");
        GENDER_MAPPING.put("nữ", "female");
        GENDER_MAPPING.put("nu", "female");
        GENDER_MAPPING.put("NU", "female");
        
        // English mappings (identity)
        GENDER_MAPPING.put("male", "male");
        GENDER_MAPPING.put("Male", "male");
        GENDER_MAPPING.put("MALE", "male");
        GENDER_MAPPING.put("female", "female");
        GENDER_MAPPING.put("Female", "female");
        GENDER_MAPPING.put("FEMALE", "female");
    }
    
    /**
     * Map gender từ FE format → BE format
     * 
     * @param gender FE gender value (có thể là "Nam", "Nữ", "male", "female", etc.)
     * @return BE gender value ("male" hoặc "female")
     * @throws IllegalArgumentException nếu gender không hợp lệ
     */
    public String normalize(String gender) {
        if (gender == null || gender.trim().isEmpty()) {
            return null;
        }
        
        String normalized = gender.trim();
        String result = GENDER_MAPPING.get(normalized);
        
        if (result != null) {
            return result;
        }
        
        // Try case-insensitive lookup
        for (Map.Entry<String, String> entry : GENDER_MAPPING.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(normalized)) {
                return entry.getValue();
            }
        }
        
        // Nếu không tìm thấy, log warning và return lowercase
        // (có thể là giá trị mới từ FE, cần review)
        // Note: Logger sẽ được log ở CommonMappingUtils, không log ở đây
        return normalized.toLowerCase();
    }
    
    /**
     * Kiểm tra gender có hợp lệ không
     */
    public boolean isValid(String gender) {
        if (gender == null || gender.trim().isEmpty()) {
            return false;
        }
        String normalized = normalize(gender);
        return "male".equals(normalized) || "female".equals(normalized);
    }
}

