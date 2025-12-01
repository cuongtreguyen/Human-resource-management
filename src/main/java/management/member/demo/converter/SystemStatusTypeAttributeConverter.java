package management.member.demo.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import management.member.demo.enums.SystemStatusType;

/**
 * JPA AttributeConverter để convert giữa SystemStatusType enum và String trong database
 * Sử dụng enum value ("idle", "running", etc.) thay vì enum name ("IDLE", "RUNNING")
 */
@Converter(autoApply = true)
public class SystemStatusTypeAttributeConverter implements AttributeConverter<SystemStatusType, String> {

    @Override
    public String convertToDatabaseColumn(SystemStatusType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue(); // Trả về "idle", "running", etc.
    }

    @Override
    public SystemStatusType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return SystemStatusType.IDLE; // Default value
        }
        // Sử dụng method fromString đã có trong enum
        return SystemStatusType.fromString(dbData);
    }
}

