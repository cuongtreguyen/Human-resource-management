package management.member.demo.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SystemStatusType {
    IDLE("idle"),
    RUNNING("running"),
    SUCCESS("success"),
    ERROR("error");

    private final String value;

    SystemStatusType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SystemStatusType fromString(String status) {
        if (status == null) {
            return IDLE;
        }
        for (SystemStatusType type : values()) {
            if (type.value.equalsIgnoreCase(status)) {
                return type;
            }
        }
        return IDLE;
    }
}

