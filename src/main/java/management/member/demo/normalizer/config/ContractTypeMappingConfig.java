package management.member.demo.normalizer.config;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Configuration cho Contract Type Mapping
 * Thay vì hardcode, dùng lookup table để dễ mở rộng
 */
@Component
public class ContractTypeMappingConfig {
    
    // Lookup table: Vietnamese/English → Standard English
    private static final Map<String, String> CONTRACT_TYPE_MAPPING = new HashMap<>();
    
    static {
        // Vietnamese mappings
        CONTRACT_TYPE_MAPPING.put("Hợp đồng không xác định thời hạn", "Full-time");
        CONTRACT_TYPE_MAPPING.put("Hợp đồng có thời hạn", "Part-time");
        CONTRACT_TYPE_MAPPING.put("Hợp đồng thử việc", "Probation");
        CONTRACT_TYPE_MAPPING.put("Hợp đồng lao động", "Full-time");
        
        // English mappings (identity)
        CONTRACT_TYPE_MAPPING.put("Full-time", "Full-time");
        CONTRACT_TYPE_MAPPING.put("full-time", "Full-time");
        CONTRACT_TYPE_MAPPING.put("FULL-TIME", "Full-time");
        CONTRACT_TYPE_MAPPING.put("Part-time", "Part-time");
        CONTRACT_TYPE_MAPPING.put("part-time", "Part-time");
        CONTRACT_TYPE_MAPPING.put("PART-TIME", "Part-time");
        CONTRACT_TYPE_MAPPING.put("Probation", "Probation");
        CONTRACT_TYPE_MAPPING.put("probation", "Probation");
    }
    
    /**
     * Map contractType từ FE format → BE format
     * 
     * @param contractType FE contract type value
     * @return BE contract type value (Full-time, Part-time, Probation)
     */
    public String normalize(String contractType) {
        if (contractType == null || contractType.trim().isEmpty()) {
            return null;
        }
        
        String normalized = contractType.trim();
        
        // Exact match
        String result = CONTRACT_TYPE_MAPPING.get(normalized);
        if (result != null) {
            return result;
        }
        
        // Case-insensitive lookup
        for (Map.Entry<String, String> entry : CONTRACT_TYPE_MAPPING.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(normalized)) {
                return entry.getValue();
            }
        }
        
        // Partial match (contains Vietnamese keywords)
        if (normalized.contains("không xác định thời hạn") || 
            normalized.contains("không xac dinh thoi han") ||
            normalized.contains("khong xac dinh thoi han")) {
            return "Full-time";
        }
        if (normalized.contains("có thời hạn") || 
            normalized.contains("co thoi han")) {
            return "Part-time";
        }
        if (normalized.contains("thử việc") || 
            normalized.contains("thu viec")) {
            return "Probation";
        }
        
        // Default: return as is (có thể là giá trị mới từ FE)
        // Note: Logger sẽ được log ở CommonMappingUtils, không log ở đây
        return normalized;
    }
}

