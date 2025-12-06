package management.member.demo.converter;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.time.LocalTime;

/**
 * Custom deserializer for LocalTime
 * Supports both string format "HH:mm" and object format {"hour": 8, "minute": 30}
 */
public class LocalTimeDeserializer extends JsonDeserializer<LocalTime> {

    @Override
    public LocalTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);
        
        // If it's a string, parse as "HH:mm"
        if (node.isTextual()) {
            String timeStr = node.asText();
            if (timeStr == null || timeStr.trim().isEmpty()) {
                return null;
            }
            return LocalTime.parse(timeStr);
        }
        
        // If it's an object, extract hour and minute
        if (node.isObject()) {
            JsonNode hourNode = node.get("hour");
            JsonNode minuteNode = node.get("minute");
            
            if (hourNode != null && minuteNode != null) {
                int hour = hourNode.asInt();
                int minute = minuteNode.asInt();
                return LocalTime.of(hour, minute);
            }
            
            // Try alternative field names
            hourNode = node.get("hours");
            minuteNode = node.get("minutes");
            if (hourNode != null && minuteNode != null) {
                int hour = hourNode.asInt();
                int minute = minuteNode.asInt();
                return LocalTime.of(hour, minute);
            }
        }
        
        // If it's a number (timestamp in seconds), convert it
        if (node.isNumber()) {
            long seconds = node.asLong();
            return LocalTime.ofSecondOfDay(seconds);
        }
        
        return null;
    }
}

